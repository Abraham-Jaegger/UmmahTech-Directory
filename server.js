require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const path = require('path');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3000;

// PostgreSQL Connection
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

app.use(express.static('public'));
app.use(express.json());

// Init DB Helper (for demo purposes)
app.post('/api/init-db', async (req, res) => {
    try {
        const schema = fs.readFileSync(path.join(__dirname, 'db', 'schema.sql'), 'utf8');
        const seed = fs.readFileSync(path.join(__dirname, 'db', 'seed.sql'), 'utf8');
        await pool.query(schema);
        await pool.query(seed);
        res.json({ message: 'Database initialized successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// API: Get Directory Data
app.get('/api/directory', async (req, res) => {
    try {
        const { search, category } = req.query;

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
        const result = await pool.query('SELECT * FROM categories ORDER BY name');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
