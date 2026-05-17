const express = require('express');
const router = express.Router();
const pool = require('../database/db');
const multer = require('multer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { put, del } = require('@vercel/blob');
const path = require('path');
const fs = require('fs');

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-for-portfolio';

let upload;
const isVercelBlob = !!process.env.BLOB_READ_WRITE_TOKEN;

if (isVercelBlob) {
    // Cloud setup (Vercel Blob)
    upload = multer({ storage: multer.memoryStorage() });
    console.log('Using Vercel Blob for uploads');
} else {
    // Local setup (Disk Storage)
    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }

    const storage = multer.diskStorage({
        destination: function (req, file, cb) { cb(null, uploadDir) },
        filename: function (req, file, cb) {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
            cb(null, uniqueSuffix + path.extname(file.originalname))
        }
    });
    upload = multer({ storage: storage });
    console.log('Using local disk storage for uploads');
}

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

router.get('/auth/status', async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT COUNT(*) as count FROM admin');
        res.json({ isSetup: parseInt(rows[0].count) > 0 });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/auth/setup', async (req, res) => {
    try {
        const { username, password } = req.body;
        const { rows } = await pool.query('SELECT COUNT(*) as count FROM admin');
        if (parseInt(rows[0].count) > 0) return res.status(400).json({ error: 'Already setup' });
        
        const hashedPassword = await bcrypt.hash(password, 10);
        await pool.query('INSERT INTO admin (username, password) VALUES ($1, $2)', [username, hashedPassword]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/auth/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const { rows } = await pool.query('SELECT * FROM admin WHERE username = $1', [username]);
        if (rows.length === 0) return res.status(401).json({ error: 'Invalid credentials' });
        
        const validPassword = await bcrypt.compare(password, rows[0].password);
        if (!validPassword) return res.status(401).json({ error: 'Invalid credentials' });
        
        const token = jwt.sign({ id: rows[0].id, username: rows[0].username }, JWT_SECRET, { expiresIn: '24h' });
        res.json({ token });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- PUBLIC DATA ROUTES ---

router.get('/portfolio', async (req, res) => {
    try {
        const data = {};
        const profileRes = await pool.query('SELECT * FROM profile ORDER BY id DESC LIMIT 1');
        data.profile = profileRes.rows[0];
        
        const expRes = await pool.query('SELECT * FROM experience ORDER BY start_date DESC');
        data.experience = expRes.rows;
        
        const projRes = await pool.query('SELECT * FROM projects ORDER BY id DESC');
        data.projects = projRes.rows;
        
        const skillsRes = await pool.query('SELECT * FROM skills');
        data.skills = skillsRes.rows;
        
        const eduRes = await pool.query('SELECT * FROM education ORDER BY start_date DESC');
        data.education = eduRes.rows;
        
        const certRes = await pool.query('SELECT * FROM certifications ORDER BY date DESC');
        data.certifications = certRes.rows;
        
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- PROTECTED ADMIN ROUTES ---

router.post('/profile', authenticateToken, async (req, res) => {
    try {
        const { name, title, bio, email, phone, github, linkedin, twitter } = req.body;
        await pool.query(
            `UPDATE profile SET name=$1, title=$2, bio=$3, email=$4, phone=$5, github=$6, linkedin=$7, twitter=$8 WHERE id = (SELECT MIN(id) FROM profile)`,
            [name, title, bio, email, phone, github, linkedin, twitter]
        );
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/upload/:type', authenticateToken, upload.single('file'), async (req, res) => {
    try {
        const type = req.params.type;
        if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
        
        let url;
        if (isVercelBlob) {
            const blob = await put(req.file.originalname, req.file.buffer, {
                access: 'public',
            });
            url = blob.url;
        } else {
            url = `http://localhost:8000/api/uploads/${req.file.filename}`;
        }
        
        let query = '';
        if (type === 'resume') {
            query = 'UPDATE profile SET resume_url=$1 WHERE id = (SELECT MIN(id) FROM profile)';
        } else if (type === 'avatar') {
            query = 'UPDATE profile SET avatar_url=$1 WHERE id = (SELECT MIN(id) FROM profile)';
        } else if (type === 'background') {
            query = 'UPDATE profile SET background_url=$1 WHERE id = (SELECT MIN(id) FROM profile)';
        }
        
        if (query) {
            await pool.query(query, [url]);
        }
        res.json({ url });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete('/upload/:type', authenticateToken, async (req, res) => {
    try {
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
        
        await pool.query(query);
        res.json({ message: 'Removed successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/:table', authenticateToken, async (req, res) => {
    try {
        const table = req.params.table;
        const allowedTables = ['projects', 'experience', 'skills', 'education', 'certifications'];
        if (!allowedTables.includes(table)) return res.status(400).json({ error: 'Invalid table' });
        
        const keys = Object.keys(req.body);
        const values = Object.values(req.body);
        const placeholders = keys.map((_, i) => `$${i + 1}`).join(',');
        
        const result = await pool.query(
            `INSERT INTO ${table} (${keys.join(',')}) VALUES (${placeholders}) RETURNING id`,
            values
        );
        res.json({ id: result.rows[0].id, ...req.body });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put('/:table/:id', authenticateToken, async (req, res) => {
    try {
        const table = req.params.table;
        const allowedTables = ['projects', 'experience', 'skills', 'education', 'certifications'];
        if (!allowedTables.includes(table)) return res.status(400).json({ error: 'Invalid table' });
        
        const id = req.params.id;
        const data = { ...req.body };
        delete data.id;
        
        const keys = Object.keys(data);
        const values = Object.values(data);
        if (keys.length === 0) return res.status(400).json({ error: 'No data provided' });
        
        const setClause = keys.map((k, i) => `${k}=$${i + 1}`).join(',');
        await pool.query(`UPDATE ${table} SET ${setClause} WHERE id=$${keys.length + 1}`, [...values, id]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete('/:table/:id', authenticateToken, async (req, res) => {
    try {
        const table = req.params.table;
        const allowedTables = ['projects', 'experience', 'skills', 'education', 'certifications'];
        if (!allowedTables.includes(table)) return res.status(400).json({ error: 'Invalid table' });
        
        await pool.query(`DELETE FROM ${table} WHERE id=$1`, [req.params.id]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
