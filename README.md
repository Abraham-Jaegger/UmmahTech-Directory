# UmmahTech Directory

A curated directory of Shariah-compliant software, businesses, and ethical alternatives. Built with Node.js, Express, and PostgreSQL, featuring a modern glassmorphism UI.

## Features
- 🔍 **Search & Filter**: Find products by category (Fintech, EdTech, Lifestyle, etc.) or keyword.
- 💎 **Glassmorphism UI**: A premium, clean, and modern light-mode interface.
- 📊 **Visual Map**: Interactive canvas visualization of the ecosystem.
- 🗄️ **PostgreSQL Backend**: Robust relational data model with recursive categories and audit logs.

## Tech Stack
- **Frontend**: HTML5, CSS3 (Vanilla), JavaScript (Vanilla)
- **Backend**: Node.js, Express
- **Database**: PostgreSQL

## Getting Started

### Prerequisites
- Node.js (v18+)
- PostgreSQL

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/your-username/ummahtech-directory.git
    cd ummahtech-directory
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Configure environment variables:
    - Copy `.env.example` to `.env`:
        ```bash
        cp .env.example .env
        ```
    - Update `DATABASE_URL` with your local credential.

4.  Initialize Database:
    ```bash
    npm run start
    # In another terminal:
    # Setup Schema & Seed Data
    node server/setup-db.js
    ```

5.  Run the application:
    ```bash
    npm start
    ```
    Visit `http://localhost:3000`.

## License
MIT
