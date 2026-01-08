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
        const seedPart2 = fs.readFileSync(path.join(__dirname, '..', 'db', 'seed_part2.sql'), 'utf8');

        console.log('🏗️  Running Schema Migration...');
        await pool.query(schema);

        console.log('🌱 Seeding Data (Part 1)...');
        await pool.query(seed);

        console.log('🌱 Seeding Data (Part 2)...');
        await pool.query(seedPart2);

        console.log('✅ Database setup complete!');
    } catch (err) {
        console.error('❌ Error setting up database:', err);
    } finally {
        await pool.end();
    }
}

setup();
