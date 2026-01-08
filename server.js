require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const path = require('path');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3000;

// PostgreSQL Connection Pool using environment variables
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

app.use(express.static('public')); // Serve static frontend files
app.use(express.json()); // Parse JSON request bodies

/**
 * Endpoint: Initialize Database
 * Runs the schema, seed, and full seed SQL files to reset the DB.
 * Returns the count of products injected.
 */
app.post('/api/init-db', async (req, res) => {
    try {
        console.log('Initializing database...');
        const schema = fs.readFileSync(path.join(__dirname, 'db', 'schema.sql'), 'utf8');
        const seed = fs.readFileSync(path.join(__dirname, 'db', 'seed.sql'), 'utf8');
        const seedFull = fs.readFileSync(path.join(__dirname, 'db', 'seed_full.sql'), 'utf8');

        console.log('Running Schema...');
        await pool.query(schema);

        console.log('Running Seed...');
        await pool.query(seed);

        console.log('Running Full Seed...');
        await pool.query(seedFull);

        const countRes = await pool.query('SELECT COUNT(*) FROM products');
        const count = countRes.rows[0].count;
        console.log('Total Products:', count);

        res.json({ message: 'Database initialized successfully', products: count });
    } catch (err) {
        console.error('Init DB Error:', err);
        res.status(500).json({ error: err.message, stack: err.stack });
    }
});

/**
 * Endpoint: Get Directory Data
 * Fetches products with optional filtering by search term or category.
 * Joins multiple tables (products, organizations, categories, tech_stack) to returns a rich object.
 */
app.get('/api/directory', async (req, res) => {
    try {
        const { search, category } = req.query;

        // Base query with JOINS to fetch related data
        let query = `
            SELECT 
                p.id, p.name, p.product_type, p.description, p.website_url,
                o.name as org_name, o.country_origin, o.verified_status,
                c.name as category_name, c.slug as category_slug,
                ts.language, ts.framework, ts.cloud_provider,
                crt.issuing_body, crt.issue_date
            FROM products p
            JOIN organizations o ON p.org_id = o.id
            LEFT JOIN categories c ON p.category_id = c.id
            LEFT JOIN tech_stack ts ON p.id = ts.product_id
            LEFT JOIN certifications crt ON p.id = crt.product_id
            WHERE 1=1
        `;

        const values = [];
        let paramCount = 1;

        // Dynamic filtering based on query params
        if (search) {
            query += ` AND (p.name ILIKE $${paramCount} OR p.description ILIKE $${paramCount} OR o.name ILIKE $${paramCount})`;
            values.push(`%${search}%`);
            paramCount++;
        }

        if (category) {
            query += ` AND c.slug = $${paramCount}`;
            values.push(category);
            paramCount++;
        }

        const result = await pool.query(query, values);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// API: Get Categories
app.get('/api/categories', async (req, res) => {
    try {
        const query = `
            SELECT c.*, COUNT(p.id)::int as product_count 
            FROM categories c 
            LEFT JOIN products p ON c.id = p.category_id 
            GROUP BY c.id 
            ORDER BY c.name
        `;
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
