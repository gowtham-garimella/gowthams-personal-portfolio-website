const { Pool } = require('pg');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

let pool;
let isPostgres = !!process.env.POSTGRES_URL;

if (isPostgres) {
    // Cloud setup (Vercel Postgres, Neon, Supabase)
    const pgPool = new Pool({
        connectionString: process.env.POSTGRES_URL,
        ssl: { rejectUnauthorized: false }
    });
    
    pgPool.on('error', (err) => {
        console.error('Unexpected error on idle client', err);
    });

    pool = {
        query: (text, params) => pgPool.query(text, params),
        on: (event, callback) => pgPool.on(event, callback)
    };
    console.log('Using PostgreSQL database');
} else {
    // Local setup (SQLite)
    // If hosted on Vercel without Postgres, /tmp is the only writable directory.
    // We copy the committed portfolio.db to /tmp so data is preserved across instances.
    const fs = require('fs');
    const dbDir = process.env.VERCEL ? '/tmp' : __dirname;
    const dbPath = path.join(dbDir, 'portfolio.db');
    
    if (process.env.VERCEL && !fs.existsSync(dbPath)) {
        try {
            fs.copyFileSync(path.join(__dirname, 'portfolio.db'), dbPath);
            console.log('Copied committed SQLite database to /tmp');
        } catch (err) {
            console.error('Failed to copy database to /tmp:', err);
        }
    }

    const openMode = sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE;
    const db = new sqlite3.Database(dbPath, openMode, (err) => {
        if (err) console.error('Error opening local database', err);
        else console.log(`Opened SQLite DB at ${dbPath} with mode ${openMode}`);
    });

    pool = {
        query: (text, params) => {
            return new Promise((resolve, reject) => {
                let sqliteText = text;
                if (params) {
                    for (let i = 1; i <= params.length; i++) {
                        sqliteText = sqliteText.replace(new RegExp(`\\$${i}\\b`, 'g'), '?');
                    }
                }
                sqliteText = sqliteText.replace(/SERIAL PRIMARY KEY/g, 'INTEGER PRIMARY KEY AUTOINCREMENT');

                db.all(sqliteText, params || [], function(err, rows) {
                    if (err) reject(err);
                    else resolve({ rows: rows || [] });
                });
            });
        },
        on: (event, callback) => {
            if (event === 'error') db.on('error', callback);
        }
    };
    console.log('Using local SQLite database');
}

async function initializeDatabase() {
    await pool.query(`CREATE TABLE IF NOT EXISTS profile (
        id SERIAL PRIMARY KEY,
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

    const profileRes = await pool.query('SELECT COUNT(*) as count FROM profile');
    if (parseInt(profileRes.rows[0].count) === 0) {
        await pool.query(
            `INSERT INTO profile (name, title, bio) VALUES ($1, $2, $3)`,
            ['Your Name', 'Software Developer', 'Welcome to my dynamic portfolio. Update this in the admin dashboard.']
        );
    }

    await pool.query(`CREATE TABLE IF NOT EXISTS experience (
        id SERIAL PRIMARY KEY,
        company TEXT,
        role TEXT,
        start_date TEXT,
        end_date TEXT,
        description TEXT
    )`);

    await pool.query(`CREATE TABLE IF NOT EXISTS projects (
        id SERIAL PRIMARY KEY,
        title TEXT,
        description TEXT,
        image_url TEXT,
        demo_url TEXT,
        github_url TEXT,
        tech_stack TEXT
    )`);

    await pool.query(`CREATE TABLE IF NOT EXISTS skills (
        id SERIAL PRIMARY KEY,
        name TEXT,
        category TEXT,
        proficiency INTEGER
    )`);

    await pool.query(`CREATE TABLE IF NOT EXISTS education (
        id SERIAL PRIMARY KEY,
        institution TEXT,
        degree TEXT,
        start_date TEXT,
        end_date TEXT,
        description TEXT
    )`);

    await pool.query(`CREATE TABLE IF NOT EXISTS certifications (
        id SERIAL PRIMARY KEY,
        title TEXT,
        issuer TEXT,
        date TEXT,
        url TEXT
    )`);

    await pool.query(`CREATE TABLE IF NOT EXISTS admin (
        id SERIAL PRIMARY KEY,
        username TEXT UNIQUE,
        password TEXT
    )`);

    console.log('Database tables verified.');
}

pool.ready = initializeDatabase();

module.exports = pool;
