const express = require('express');
const router = express.Router();
const db = require('../database/db');
const multer = require('multer');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'super-secret-key-for-portfolio'; // in production, use process.env.JWT_SECRET

// Multer setup for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../uploads'));
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// Authentication Middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (token == null) return res.sendStatus(401);
    
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// --- AUTHENTICATION & SETUP ROUTES ---

// Check if admin is set up
router.get('/auth/status', (req, res) => {
    db.get('SELECT COUNT(*) as count FROM admin', (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ isSetup: row.count > 0 });
    });
});

// Initial Setup
router.post('/auth/setup', async (req, res) => {
    const { username, password } = req.body;
    db.get('SELECT COUNT(*) as count FROM admin', async (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (row.count > 0) return res.status(400).json({ error: 'Already setup' });
        
        const hashedPassword = await bcrypt.hash(password, 10);
        db.run('INSERT INTO admin (username, password) VALUES (?, ?)', [username, hashedPassword], function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ success: true });
        });
    });
});

// Login
router.post('/auth/login', (req, res) => {
    const { username, password } = req.body;
    db.get('SELECT * FROM admin WHERE username = ?', [username], async (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!row) return res.status(401).json({ error: 'Invalid credentials' });
        
        const validPassword = await bcrypt.compare(password, row.password);
        if (!validPassword) return res.status(401).json({ error: 'Invalid credentials' });
        
        const token = jwt.sign({ id: row.id, username: row.username }, JWT_SECRET, { expiresIn: '24h' });
        res.json({ token });
    });
});

// --- PUBLIC DATA ROUTES ---

// Get all portfolio data
router.get('/portfolio', (req, res) => {
    const data = {};
    
    db.serialize(() => {
        db.get('SELECT * FROM profile ORDER BY id DESC LIMIT 1', (err, row) => {
            data.profile = row;
            db.all('SELECT * FROM experience ORDER BY start_date DESC', (err, rows) => {
                data.experience = rows;
                db.all('SELECT * FROM projects ORDER BY id DESC', (err, rows) => {
                    data.projects = rows;
                    db.all('SELECT * FROM skills', (err, rows) => {
                        data.skills = rows;
                        db.all('SELECT * FROM education ORDER BY start_date DESC', (err, rows) => {
                            data.education = rows;
                            db.all('SELECT * FROM certifications ORDER BY date DESC', (err, rows) => {
                                data.certifications = rows;
                                res.json(data);
                            });
                        });
                    });
                });
            });
        });
    });
});

// --- PROTECTED ADMIN ROUTES ---

// Update Profile
router.post('/profile', authenticateToken, (req, res) => {
    const { name, title, bio, email, phone, github, linkedin, twitter } = req.body;
    
    // We just update the first row
    db.run(`UPDATE profile SET name=?, title=?, bio=?, email=?, phone=?, github=?, linkedin=?, twitter=? WHERE id = (SELECT MIN(id) FROM profile)`,
        [name, title, bio, email, phone, github, linkedin, twitter], function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ success: true });
        }
    );
});

// Upload Resume/Avatar
router.post('/upload/:type', authenticateToken, upload.single('file'), (req, res) => {
    const type = req.params.type;
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    
    const url = '/uploads/' + req.file.filename;
    let query = '';
    
    if (type === 'resume') {
        query = 'UPDATE profile SET resume_url=? WHERE id = (SELECT MIN(id) FROM profile)';
    } else if (type === 'avatar') {
        query = 'UPDATE profile SET avatar_url=? WHERE id = (SELECT MIN(id) FROM profile)';
    } else if (type === 'background') {
        query = 'UPDATE profile SET background_url=? WHERE id = (SELECT MIN(id) FROM profile)';
    }
    
    if (query) {
        db.run(query, [url], (err) => {
            if (err) return res.status(500).json({ error: 'Database error' });
            res.json({ url });
        });
    } else {
        res.json({ url });
    }
});

// Remove Resume/Avatar/Background
router.delete('/upload/:type', authenticateToken, (req, res) => {
    const type = req.params.type;
    let query = '';
    
    if (type === 'resume') {
        query = 'UPDATE profile SET resume_url=NULL WHERE id = (SELECT MIN(id) FROM profile)';
    } else if (type === 'avatar') {
        query = 'UPDATE profile SET avatar_url=NULL WHERE id = (SELECT MIN(id) FROM profile)';
    } else if (type === 'background') {
        query = 'UPDATE profile SET background_url=NULL WHERE id = (SELECT MIN(id) FROM profile)';
    } else {
        return res.status(400).json({ error: 'Invalid type' });
    }
    
    db.run(query, (err) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json({ message: 'Removed successfully' });
    });
});

// Create item generically (projects, experience, skills, education)
router.post('/:table', authenticateToken, (req, res) => {
    const table = req.params.table;
    const allowedTables = ['projects', 'experience', 'skills', 'education', 'certifications'];
    
    if (!allowedTables.includes(table)) return res.status(400).json({ error: 'Invalid table' });
    
    const keys = Object.keys(req.body);
    const values = Object.values(req.body);
    const placeholders = keys.map(() => '?').join(',');
    
    db.run(`INSERT INTO ${table} (${keys.join(',')}) VALUES (${placeholders})`, values, function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: this.lastID, ...req.body });
    });
});

// Update item
router.put('/:table/:id', authenticateToken, (req, res) => {
    const table = req.params.table;
    const allowedTables = ['projects', 'experience', 'skills', 'education', 'certifications'];
    
    if (!allowedTables.includes(table)) return res.status(400).json({ error: 'Invalid table' });
    
    const id = req.params.id;
    // remove 'id' from body if present to avoid updating primary key
    const data = { ...req.body };
    delete data.id;
    
    const keys = Object.keys(data);
    const values = Object.values(data);
    
    if (keys.length === 0) return res.status(400).json({ error: 'No data provided' });
    
    const setClause = keys.map(k => `${k}=?`).join(',');
    
    db.run(`UPDATE ${table} SET ${setClause} WHERE id=?`, [...values, id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true });
    });
});

// Delete item
router.delete('/:table/:id', authenticateToken, (req, res) => {
    const table = req.params.table;
    const allowedTables = ['projects', 'experience', 'skills', 'education', 'certifications'];
    
    if (!allowedTables.includes(table)) return res.status(400).json({ error: 'Invalid table' });
    
    db.run(`DELETE FROM ${table} WHERE id=?`, [req.params.id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true });
    });
});

module.exports = router;
