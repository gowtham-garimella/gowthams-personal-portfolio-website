const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

let pool;
let isPostgres = !!process.env.POSTGRES_URL;

const tables = ['profile', 'experience', 'projects', 'skills', 'education', 'certifications', 'admin'];

function createEmptyData() {
    return Object.fromEntries(tables.map((table) => [table, []]));
}

function createJsonPool() {
    const dataPath = path.join('/tmp', 'portfolio-data.json');
    let blobLoaded = false;

    const downloadFromBlob = async () => {
        if (!process.env.BLOB_READ_WRITE_TOKEN) return false;
        try {
            const { list } = require('@vercel/blob');
            const { blobs } = await list({ prefix: 'portfolio-data.json' });
            const targetBlob = blobs.find(b => b.pathname === 'portfolio-data.json');
            if (targetBlob) {
                const response = await fetch(targetBlob.url);
                if (response.ok) {
                    const text = await response.text();
                    fs.writeFileSync(dataPath, text);
                    return true;
                }
            }
        } catch (err) {
            console.error("Error downloading from Blob:", err);
        }
        return false;
    };

    const uploadToBlob = async () => {
        if (!process.env.BLOB_READ_WRITE_TOKEN) return;
        try {
            const { put } = require('@vercel/blob');
            const content = fs.readFileSync(dataPath, 'utf8');
            await put('portfolio-data.json', content, {
                access: 'public',
                addRandomSuffix: false,
            });
        } catch (err) {
            console.error("Error uploading to Blob:", err);
        }
    };

    const readData = async () => {
        if (!blobLoaded) {
            await downloadFromBlob();
            blobLoaded = true;
        }
        if (!fs.existsSync(dataPath)) return createEmptyData();
        try {
            return { ...createEmptyData(), ...JSON.parse(fs.readFileSync(dataPath, 'utf8')) };
        } catch (e) {
            return createEmptyData();
        }
    };

    const writeData = async (data) => {
        fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
        await uploadToBlob();
    };

    const nextId = (items) => Math.max(0, ...items.map((item) => Number(item.id) || 0)) + 1;

    return {
        query: async (text, params = []) => {
            const data = await readData();
            const normalized = text.replace(/\s+/g, ' ').trim();

            if (normalized.startsWith('CREATE TABLE')) return { rows: [] };

            const countMatch = normalized.match(/^SELECT COUNT\(\*\) as count FROM (\w+)/i);
            if (countMatch) {
                return { rows: [{ count: data[countMatch[1]].length }] };
            }

            const selectWhereMatch = normalized.match(/^SELECT \* FROM (\w+) WHERE (\w+) = \$1/i);
            if (selectWhereMatch) {
                const [, table, field] = selectWhereMatch;
                return { rows: data[table].filter((item) => item[field] === params[0]) };
            }

            const selectAllMatch = normalized.match(/^SELECT \* FROM (\w+)/i);
            if (selectAllMatch) {
                const table = selectAllMatch[1];
                let rows = [...data[table]];
                if (/ORDER BY id DESC/i.test(normalized)) rows.sort((a, b) => Number(b.id) - Number(a.id));
                if (/ORDER BY start_date DESC/i.test(normalized)) rows.sort((a, b) => String(b.start_date || '').localeCompare(String(a.start_date || '')));
                if (/ORDER BY date DESC/i.test(normalized)) rows.sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')));
                if (/LIMIT 1/i.test(normalized)) rows = rows.slice(0, 1);
                return { rows };
            }

            const insertMatch = normalized.match(/^INSERT INTO (\w+) \(([^)]+)\) VALUES/i);
            if (insertMatch) {
                const [, table, keyText] = insertMatch;
                const keys = keyText.split(',').map((key) => key.trim());
                const row = { id: nextId(data[table]) };
                keys.forEach((key, index) => {
                    row[key] = params[index];
                });
                data[table].push(row);
                await writeData(data);
                return { rows: [{ id: row.id }] };
            }

            const updateProfileMatch = normalized.match(/^UPDATE profile SET (.+) WHERE id = \(SELECT MIN\(id\) FROM profile\)/i);
            if (updateProfileMatch) {
                if (data.profile.length === 0) data.profile.push({ id: 1 });
                const profile = data.profile.reduce((first, item) => Number(item.id) < Number(first.id) ? item : first, data.profile[0]);
                updateProfileMatch[1].split(',').forEach((assignment, index) => {
                    const key = assignment.split('=')[0].trim();
                    profile[key] = params[index] ?? null;
                });
                await writeData(data);
                return { rows: [] };
            }

            const updateMatch = normalized.match(/^UPDATE (\w+) SET (.+) WHERE id=\$\d+/i);
            if (updateMatch) {
                const [, table, setClause] = updateMatch;
                const id = params[params.length - 1];
                const item = data[table].find((row) => String(row.id) === String(id));
                if (item) {
                    setClause.split(',').forEach((assignment, index) => {
                        const key = assignment.split('=')[0].trim();
                        item[key] = params[index];
                    });
                    await writeData(data);
                }
                return { rows: [] };
            }

            const deleteMatch = normalized.match(/^DELETE FROM (\w+) WHERE id=\$1/i);
            if (deleteMatch) {
                const table = deleteMatch[1];
                data[table] = data[table].filter((row) => String(row.id) !== String(params[0]));
                await writeData(data);
                return { rows: [] };
            }

            throw new Error(`Unsupported JSON database query: ${normalized}`);
        },
        on: () => {}
    };
}

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
} else if (process.env.VERCEL) {
    pool = createJsonPool();
    console.log('Using Vercel JSON fallback database');
} else {
    // Local setup (SQLite)
    const sqlite3 = require('sqlite3').verbose();
    const dbPath = path.join(__dirname, 'portfolio.db');

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
