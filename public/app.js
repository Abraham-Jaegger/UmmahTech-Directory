const state = {
    categories: [],
    products: [],
    filter: ''
};

// Canvas Map Visualization
function initMap() {
    const canvas = document.getElementById('mapCanvas');
    const ctx = canvas.getContext('2d');

    // Resize
    const resize = () => {
        canvas.width = canvas.parentElement.offsetWidth;
        canvas.height = canvas.parentElement.offsetHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    // Simple Particle Animation for Effect
    const particles = [];
    for (let i = 0; i < 30; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            r: Math.random() * 3 + 1,
            dx: (Math.random() - 0.5) * 0.5,
            dy: (Math.random() - 0.5) * 0.5
        });
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'rgba(37, 99, 235, 0.2)'; // Accent color

        particles.forEach(p => {
            p.x += p.dx;
            p.y += p.dy;

            if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
            if (p.y < 0 || p.y > canvas.height) p.dy *= -1;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fill();

            // Draw connections
            particles.forEach(p2 => {
                const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
                if (dist < 100) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(37, 99, 235, ${0.1 - dist / 1000})`;
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.stroke();
                }
            });
        });

        requestAnimationFrame(animate);
    }
    animate();
}

async function fetchCategories() {
    try {
        const res = await fetch('/api/categories');
        state.categories = await res.json();
        renderCategories();
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

// Init
document.addEventListener('DOMContentLoaded', () => {
    initMap();
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
