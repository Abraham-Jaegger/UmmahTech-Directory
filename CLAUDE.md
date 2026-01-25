# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start              # Start server at localhost:3000
curl -X POST http://localhost:3000/api/init-db  # Init/reset DB with seed data
```

Requires PostgreSQL running with `DATABASE_URL` in `.env`.

## Architecture

**Backend**: Express server (`server.js`) with 3 endpoints:

- `POST /api/init-db` - Reset DB, run schema + seeds
- `GET /api/directory` - Products with search/category filters, joins orgs/categories/tech_stack/certifications
- `GET /api/categories` - Categories with product counts

**Frontend**: Vanilla JS SPA (`public/`)

- `app.js` - State management, Canvas-based hexagon map with physics simulation, category filters, search
- Map: Force-directed graph where categories are fixed anchors, products orbit around them

**Database** (`db/`):

- `schema.sql` - 7 tables: organizations, categories, products, tech_stack, integrations, certifications, compliance_logs
- Seeds: `seed.sql`, `seed_full.sql`, `seed_part2.sql`

**Data flow**: Frontend fetches → state object → renders grid + refreshes Canvas map
