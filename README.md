# UmmahTech Directory 🌙✨

**UmmahTech Directory** is a modern, curated platform designed to showcase Shariah-compliant software, ethical businesses, and halal-friendly digital services. It serves as a central hub for the Muslim community to discover technology that aligns with their values, from Fintech and EdTech to Lifestyle and Web3 solutions.

The project features a unique **interactive ecosystem map** that visualizes the connections between different sectors and products using a physics-based hexagon interface.

---

## 🌟 Key Features

### 1. Interactive Ecosystem Map
- **Visual Exploration**: A force-directed graph (Hexagon Hive) that visualizes the Halal Tech landscape.
- **Physics Engine**: "Grounded" physics simulation where category nodes act as fixed anchors and product nodes tether to them.
- **Dynamic Interactions**: Hover effects with shadows, click-to-filter functionality, and a dedicated reset button.
- **Live Data**: The visualization reflects real-time data from the database, showing the exact number of products per category.

### 2. Modern Glassmorphism UI
- **Aesthetics**: Built with a glassmorphism design, featuring translucent panels, blurred backgrounds, and soft gradients.
- **Responsive Design**: Fully optimized for desktop and mobile devices.
- **Dark Mode**: A dedicated dark theme that adjusts colors, contrasts, and shadows for comfortable night-time browsing.

### 3. Robust Search & Discovery
- **Instant Search**: Real-time filtering by product name, description, or organization.
- **Category Filtering**: One-click filtering to narrow down the directory to specific sectors like *Fintech*, *HealthTech*, or *E-commerce*.

### 4. Technical Depth
- **PostgreSQL Backend**: Data is structured in a relational database with support for complex queries and categorization.
- **Seed Data**: Includes a comprehensive seed script that populates the database with over 20+ real-world examples of Halal tech companies.

---

## 🛠️ Tech Stack

- **Frontend**: 
  - HTML5 & CSS3 (Custom Properties, Flexbox/Grid)
  - Vanilla JavaScript (Canvas API for visualization)
- **Backend**: 
  - Node.js
  - Express.js (REST API)
- **Database**: 
  - PostgreSQL (via `pg` library)

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **PostgreSQL** (installed and running)

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/Abraham-Jaegger/UmmahTech-Directory.git
    cd UmmahTech-Directory
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Database Setup**
    - Create a PostgreSQL database (e.g., `ummahtech`).
    - Rename the example environment file:
      ```bash
      cp .env.example .env
      ```
    - Edit `.env` with your database credentials:
      ```env
      DATABASE_URL=postgres://user:password@localhost:5432/ummahtech
      PORT=3000
      ```

4.  **Run the Server**
    ```bash
    npm start
    ```
    The server will start at `http://localhost:3000`.

5.  **Initialize Data**
    To populate the database with the categories and sample products, run this command (while the server is running):
    ```bash
    curl -X POST http://localhost:3000/api/init-db
    ```
    *This will reset the database tables and seed them with the full dataset.*

---

## 🐳 Development Setup (Docker)

Quick setup using Docker for Postgres:

```bash
# Start Postgres container
docker run -d \
  --name ummahtech-db \
  -e POSTGRES_USER=ummahtech \
  -e POSTGRES_PASSWORD=ummahtech \
  -e POSTGRES_DB=ummahtech \
  -p 5432:5432 \
  postgres:16-alpine

# Update .env
echo "DATABASE_URL=postgres://ummahtech:ummahtech@localhost:5432/ummahtech" > .env
echo "PORT=3000" >> .env

# Install & run
npm install
npm start

# Init database (in another terminal)
curl -X POST http://localhost:3000/api/init-db
```

**Useful commands:**
```bash
docker stop ummahtech-db    # Stop container
docker start ummahtech-db   # Start again
docker rm ummahtech-db      # Remove container
docker logs ummahtech-db    # View logs
```

---

## 📸 Usage

- **Browse**: Scroll through the grid of cards to see all listed companies.
- **Explore**: Use the map at the top. Click a green category hexagon to filter the list. Click a purple product hexagon to find that specific item.
- **Search**: Type in the search bar to find specific apps like "Wahed" or "Zabihah".
- **Toggle Theme**: Use the specific toggle button (Sun/Moon) to switch between Light and Dark modes.

---

## 🤝 Contributing

We welcome contributions! If you know of a Shariah-compliant app that is missing, please open an issue or submit a pull request.

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
