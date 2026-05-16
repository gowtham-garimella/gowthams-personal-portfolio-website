const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.join(__dirname, 'portfolio.db');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error connecting to database', err);
    } else {
        console.log('Connected to SQLite database');
        initializeDatabase();
    }
});

function initializeDatabase() {
    db.serialize(() => {
        // User Profile Table
        db.run(`CREATE TABLE IF NOT EXISTS profile (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            title TEXT,
            bio TEXT,
            email TEXT,
            phone TEXT,
            github TEXT,
            linkedin TEXT,
            twitter TEXT,
            resume_url TEXT,
            avatar_url TEXT,
            background_url TEXT
        )`);

        // Safely add background_url column if migrating from an older schema
        db.run(`ALTER TABLE profile ADD COLUMN background_url TEXT`, (err) => {
            // Ignore error if column already exists
        });

        // Insert default profile if not exists
        db.get('SELECT COUNT(*) as count FROM profile', (err, row) => {
            if (!err && row.count === 0) {
                db.run(`INSERT INTO profile (name, title, bio) VALUES (?, ?, ?)`, 
                ['Your Name', 'Software Developer', 'Welcome to my dynamic portfolio. Update this in the admin dashboard.']);
            }
        });

        // Experience Table
        db.run(`CREATE TABLE IF NOT EXISTS experience (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            company TEXT,
            role TEXT,
            start_date TEXT,
            end_date TEXT,
            description TEXT
        )`);

        // Projects Table
        db.run(`CREATE TABLE IF NOT EXISTS projects (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT,
            description TEXT,
            image_url TEXT,
            demo_url TEXT,
            github_url TEXT,
            tech_stack TEXT
        )`);

        // Skills Table
        db.run(`CREATE TABLE IF NOT EXISTS skills (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            category TEXT,
            proficiency INTEGER
        )`);

        // Education Table
        db.run(`CREATE TABLE IF NOT EXISTS education (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            institution TEXT,
            degree TEXT,
            start_date TEXT,
            end_date TEXT,
            description TEXT
        )`);

        // Certifications Table
        db.run(`CREATE TABLE IF NOT EXISTS certifications (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT,
            issuer TEXT,
            date TEXT,
            url TEXT
        )`);

        // Admin Table
        db.run(`CREATE TABLE IF NOT EXISTS admin (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE,
            password TEXT
        )`);
    });
}

module.exports = db;
