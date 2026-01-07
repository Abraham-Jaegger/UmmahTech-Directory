require('dotenv').config();
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

async function setup() {
    try {
        console.log('🔗 Connecting to database...');
        const schema = fs.readFileSync(path.join(__dirname, '..', 'db', 'schema.sql'), 'utf8');
        const seed = fs.readFileSync(path.join(__dirname, '..', 'db', 'seed.sql'), 'utf8');

        console.log('🏗️  Running Schema Migration...');
        await pool.query(schema);

        console.log('🌱 Seeding Data...');
        await pool.query(seed);

        console.log('✅ Database setup complete!');
    } catch (err) {
        console.error('❌ Error setting up database:', err);
    } finally {
        await pool.end();
    }
}

setup();
