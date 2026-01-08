/**
 * Global State Management
 * Stores the current categories, products, and active filter settings.
 */
const state = {
    categories: [],
    products: [],
    filter: ''
};

// Canvas Map Visualization
function initMap() {
    const canvas = document.getElementById('mapCanvas');
    const ctx = canvas.getContext('2d');
    const overlay = document.querySelector('.map-overlay');

    // Simulation nodes and links
    let nodes = [];
    let links = [];

    // Reset View
    const resetBtn = document.getElementById('resetMapBtn');
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            // Reset UI
            document.getElementById('searchInput').value = '';
            document.querySelectorAll('.glass-btn').forEach(b => b.classList.remove('active'));
            document.querySelector('#categoryFilters button:first-child').classList.add('active');

            // Reset State and Fetch
            state.filter = '';
            fetchProducts('', '');
        });
    }
    let animationId;
    let draggedNode = null;
    let hoveredNode = null;

    // Parameters for Hexagon Hive (Grounded)
    const CAT_RADIUS = 30;
    const PROD_RADIUS = 12;
    const LINK_STRENGTH = 0.1; // Stiff links
    const REPULSION = 150; // Local repulsion only

    // Resize
    const resize = () => {
        canvas.width = canvas.parentElement.offsetWidth;
        canvas.height = canvas.parentElement.offsetHeight;
        restartSimulation();
    };
    window.addEventListener('resize', resize);

    // transform interactions
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('click', handleClick);

    // Helper: Draw Hexagon
    function drawHexagon(ctx, x, y, radius) {
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
            const angle = (Math.PI / 3) * i; // 60 degrees
            const sx = x + radius * Math.cos(angle);
            const sy = y + radius * Math.sin(angle);
            if (i === 0) ctx.moveTo(sx, sy);
            else ctx.lineTo(sx, sy);
        }
        ctx.closePath();
    }

    function buildGraph() {
        nodes = [];
        links = [];
        const width = canvas.width;
        const height = canvas.height;
        const ringRadius = Math.min(width, height) * 0.35; // Fixed Ring Radius

        // 1. Create Category Nodes (ANCHORS)
        state.categories.forEach((cat, i) => {
            const angle = (i / state.categories.length) * Math.PI * 2 - Math.PI / 2; // Start top

            nodes.push({
                id: `cat-${cat.id}`,
                type: 'category',
                name: cat.name,
                slug: cat.slug,
                count: cat.product_count || 0, // Use backend count
                // Fixed position
                x: width / 2 + Math.cos(angle) * ringRadius,
                y: height / 2 + Math.sin(angle) * ringRadius,
                vx: 0,
                vy: 0,
                fx: width / 2 + Math.cos(angle) * ringRadius, // Fixed X
                fy: height / 2 + Math.sin(angle) * ringRadius, // Fixed Y
                radius: CAT_RADIUS,
                color: '#0d9488'
            });
        });

        // 2. Create Product Nodes
        state.products.forEach(prod => {
            const catNode = nodes.find(n => n.type === 'category' && (n.name === prod.category_name || n.slug === prod.category_slug));

            // Spawn EXACTLY at parent location (bloom out effect)
            const x = catNode ? catNode.x : width / 2;
            const y = catNode ? catNode.y : height / 2;

            const prodNode = {
                id: `prod-${prod.id}`,
                type: 'product',
                name: prod.name,
                catId: catNode ? catNode.id : null,
                x: x + (Math.random() - 0.5) * 10, // Slight jitter to prevent stack
                y: y + (Math.random() - 0.5) * 10,
                vx: 0,
                vy: 0,
                radius: PROD_RADIUS,
                color: catNode ? '#c084fc' : '#9ca3af',
                data: prod
            };
            nodes.push(prodNode);

            if (catNode) {
                links.push({ source: prodNode, target: catNode });
            }
        });
    }

    /**
     * Physics Update Loop
     * Handles the movement and interaction of nodes.
     * 1. Repulsion: prevents nodes from overlapping.
     * 2. Spring Links: keeps products tethered to their category.
     * 3. Damping: ensures the animation settles aggressively ("Grounded" feel).
     */
    function updatePhysics() {
        const width = canvas.width;
        const height = canvas.height;

        // 1. Repulsion (Only among products to prevent overlap)
        for (let i = 0; i < nodes.length; i++) {
            if (nodes[i].type === 'category') continue; // Skip categories for repulsion source (optional, but keep simple)

            for (let j = i + 1; j < nodes.length; j++) {
                if (nodes[j].type === 'category') continue;

                const a = nodes[i];
                const b = nodes[j];
                const dx = a.x - b.x;
                const dy = a.y - b.y;
                let dist = Math.sqrt(dx * dx + dy * dy) || 1;

                if (dist < 60) { // Small local range
                    const force = REPULSION / (dist * dist);
                    const fx = (dx / dist) * force;
                    const fy = (dy / dist) * force;

                    a.vx += fx;
                    a.vy += fy;
                    b.vx -= fx;
                    b.vy -= fy;
                }
            }
        }

        // 2. Links (Tether to Anchor)
        links.forEach(link => {
            const product = link.source;
            const category = link.target; // Fixed

            const dx = category.x - product.x;
            const dy = category.y - product.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            // Spring to Orbit
            const targetDist = 60; // Orbit radius
            const force = (dist - targetDist) * LINK_STRENGTH;

            const fx = (dx / dist) * force;
            const fy = (dy / dist) * force;

            product.vx += fx;
            product.vy += fy;
            // Category DOES NOT MOVE
        });

        // 3. Movement & Damping
        nodes.forEach(node => {
            if (node.type === 'category') {
                // Ensure fixed
                node.x = node.fx;
                node.y = node.fy;
                node.vx = 0;
                node.vy = 0;
                return;
            }

            // Apply velocity
            node.x += node.vx;
            node.y += node.vy;

            // Heavy Damping -> "Grounded"
            node.vx *= 0.80;
            node.vy *= 0.80;

            // Hard Stop if very slow (Solidify)
            if (Math.abs(node.vx) < 0.01) node.vx = 0;
            if (Math.abs(node.vy) < 0.01) node.vy = 0;
        });
    }

    /**
     * Render Loop
     * Clears the canvas and redraws all elements (links, nodes, labels).
     * Runs on every animation frame.
     */
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw Links
        ctx.strokeStyle = document.body.classList.contains('dark-mode') ?
            'rgba(20, 184, 166, 0.15)' : 'rgba(13, 148, 136, 0.15)'; // Tealish link
        ctx.lineWidth = 1;

        ctx.beginPath();
        links.forEach(link => {
            ctx.moveTo(link.source.x, link.source.y);
            ctx.lineTo(link.target.x, link.target.y);
        });
        ctx.stroke();

        // Draw Nodes (Hexagons)
        nodes.forEach(node => {

            // Fill Styles
            let fillStyle;
            if (node.type === 'category') {
                // Teal Gradient
                const grad = ctx.createLinearGradient(node.x - node.radius, node.y - node.radius, node.x + node.radius, node.y + node.radius);
                grad.addColorStop(0, '#14b8a6'); // Teal 500
                grad.addColorStop(1, '#0f766e'); // Teal 700
                fillStyle = grad;
            } else {
                // Product
                const isDark = document.body.classList.contains('dark-mode');
                // Gold accent for verified? Let's just do Slate/White for now with Gold Border
                fillStyle = isDark ? 'rgba(30, 41, 59, 0.9)' : 'rgba(255, 255, 255, 0.95)';
            }

            drawHexagon(ctx, node.x, node.y, node.radius);
            ctx.fillStyle = fillStyle;
            ctx.fill();

            // Borders
            ctx.lineWidth = 2;
            if (node.type === 'category') {
                ctx.strokeStyle = '#ccfbf1'; // Teal 100
            } else {
                // Gold border for products to give "verified" feel or just premium
                ctx.strokeStyle = document.body.classList.contains('dark-mode') ? '#fbbf24' : '#d97706'; // Amber 400/600
            }
            ctx.stroke();

            // Hover effect
            if (node === hoveredNode) {
                ctx.save(); // Save state
                ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
                ctx.shadowBlur = 15;
                ctx.shadowOffsetX = 0;
                ctx.shadowOffsetY = 4;

                ctx.strokeStyle = '#fff';
                ctx.lineWidth = 3;

                drawHexagon(ctx, node.x, node.y, node.radius + 2);
                ctx.stroke();

                ctx.restore(); // Restore to remove shadow for other elements
            }

            // Labels
            if (node.type === 'category' || node === hoveredNode) {
                ctx.fillStyle = document.body.classList.contains('dark-mode') ? '#f0f9ff' : '#0f172a';
                ctx.textAlign = 'center';

                if (node.type === 'category') {
                    // Show Count INSIDE
                    ctx.font = 'bold 14px Inter';
                    ctx.fillText(node.count, node.x, node.y + 5); // Center number

                    // Show Name BELOW
                    ctx.font = '600 11px Inter';
                    ctx.fillText(node.name, node.x, node.y + node.radius + 14);
                } else {
                    // Just name for product
                    ctx.font = '10px Inter';
                    ctx.fillText(node.name, node.x, node.y + node.radius + 14);
                }
            }
        });
    }

    function animate() {
        updatePhysics();
        draw();
        animationId = requestAnimationFrame(animate);
    }

    function restartSimulation() {
        if (state.categories.length > 0) {
            buildGraph();
            // Start loop if not already running
            if (!animationId) animate();
        }
    }

    // Interaction Handlers
    function handleMouseMove(e) {
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        hoveredNode = null;
        let found = false;

        // Check collision (reverse to hit top nodes first if overlapping)
        for (let i = nodes.length - 1; i >= 0; i--) {
            const node = nodes[i];
            const dx = mouseX - node.x;
            const dy = mouseY - node.y;
            if (dx * dx + dy * dy < node.radius * node.radius) {
                hoveredNode = node;
                found = true;
                break;
            }
        }

        canvas.style.cursor = found ? 'pointer' : 'default';
    }

    function handleClick(e) {
        if (!hoveredNode) return;

        if (hoveredNode.type === 'category') {
            // Activate category filter
            const slug = hoveredNode.slug;
            // Find button
            const btn = document.querySelector(`button[data-category="${slug}"]`) ||
                Array.from(document.querySelectorAll('.glass-btn')).find(b => b.textContent === hoveredNode.name); // fallback logic
            if (btn) btn.click();

        } else if (hoveredNode.type === 'product') {
            // Scroll to card logic
            // Assuming card title matches node name approx or filtering happens
            // Just focus input as simplest feedback or console log for now
            console.log('Clicked product:', hoveredNode.name);
            // Ideally trigger search or highlight
            const searchInput = document.getElementById('searchInput');
            searchInput.value = hoveredNode.name;
            fetchProducts(hoveredNode.name, ''); // Search for it specifically
        }
    }

    // Expose restart to be called after data fetch
    window.refreshMap = restartSimulation;

    // Initial call
    resize();
}

async function fetchCategories() {
    try {
        const res = await fetch('/api/categories');
        state.categories = await res.json();
        renderCategories();
        if (window.refreshMap) window.refreshMap();
    } catch (e) {
        console.error("Failed to fetch categories", e);
    }
}

async function fetchProducts(search = '', category = '') {
    try {
        let url = `/api/directory?`;
        if (search) url += `search=${encodeURIComponent(search)}&`;
        if (category) url += `category=${encodeURIComponent(category)}`;

        const res = await fetch(url);
        state.products = await res.json();
        renderGrid();
        // optionally refresh map if this was a broad fetch ?
        // For now, let's only refresh map if we have categories and it looks like a meaningful update
        if (state.categories.length > 0 && window.refreshMap) window.refreshMap();
    } catch (e) {
        console.error("Failed to fetch products", e);
    }
}

function renderCategories() {
    const container = document.getElementById('categoryFilters');
    state.categories.forEach(cat => {
        const btn = document.createElement('button');
        btn.className = 'glass-btn';
        btn.textContent = cat.name;
        btn.dataset.category = cat.slug; // Crucial for map interaction
        btn.onclick = () => {
            document.querySelectorAll('.glass-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            state.filter = cat.slug;
            fetchProducts(document.getElementById('searchInput').value, state.filter);
        };
        container.appendChild(btn);
    });

    // Wire up "All" button
    const allBtn = container.querySelector('button:first-child'); // The "All" button
    allBtn.onclick = () => {
        document.querySelectorAll('.glass-btn').forEach(b => b.classList.remove('active'));
        allBtn.classList.add('active');
        state.filter = '';
        fetchProducts(document.getElementById('searchInput').value, '');
    };
}

function renderGrid() {
    const container = document.getElementById('gridContainer');
    container.innerHTML = '';

    if (state.products.length === 0) {
        container.innerHTML = `<div class="glass-panel" style="grid-column: 1/-1; text-align: center; color: #666;">No results found.</div>`;
        return;
    }

    state.products.forEach(p => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <div class="card-header">
                <h3 class="card-title">${p.name} ${p.verified_status ? '<span class="verified-badge">✓</span>' : ''}</h3>
                <span class="card-cat">${p.category_name || 'Uncategorized'}</span>
            </div>
            <p class="card-desc">${p.description || 'No description available.'}</p>
            <div class="card-meta">
                <div style="margin-bottom: 8px;">
                    ${p.language ? `<span class="tech-tag">${p.language}</span>` : ''}
                    ${p.framework ? `<span class="tech-tag">${p.framework}</span>` : ''}
                    ${p.cloud_provider ? `<span class="tech-tag">${p.cloud_provider}</span>` : ''}
                </div>
                <div class="compliance-status">
                    Certified by ${p.issuing_body || 'Pending'}
                </div>
                ${p.website_url ? `<a href="${p.website_url}" target="_blank" class="visit-btn">Visit Website ↗</a>` : ''}
            </div>
        `;
        container.appendChild(card);
    });
}

// Dark Mode Logic
function initTheme() {
    const toggleBtn = document.getElementById('themeToggle');
    const savedTheme = localStorage.getItem('theme');

    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.body.classList.add('dark-mode');
        toggleBtn.textContent = '☀️';
    }

    toggleBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        toggleBtn.textContent = isDark ? '☀️' : '🌙';
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });
}

// Init
document.addEventListener('DOMContentLoaded', () => {
    initMap();
    initTheme();
    fetchCategories();
    fetchProducts();

    // Search Listener
    const searchInput = document.getElementById('searchInput');
    let debounce;
    searchInput.addEventListener('input', (e) => {
        clearTimeout(debounce);
        debounce = setTimeout(() => {
            fetchProducts(e.target.value, state.filter);
        }, 300);
    });
});
