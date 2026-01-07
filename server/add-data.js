require('dotenv').config();
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

async function addData() {
    try {
        console.log('🔗 Connecting to database...');
        const seed = fs.readFileSync(path.join(__dirname, '..', 'db', 'seed_part2.sql'), 'utf8');

        console.log('🌱 Adding Additional Data...');
        await pool.query(seed);

        console.log('✅ Data added successfully!');
    } catch (err) {
        console.error('❌ Error adding data:', err);
    } finally {
        await pool.end();
    }
}

addData();
