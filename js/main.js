// ================= MAIN JAVASCRIPT =================

// Global state
let currentTheme = 'cyberpunk';
let adminToken = localStorage.getItem('adminToken') || '';
let allProjects = [];
let allThemes = [];
let settings = {};

// ================= PARTICLES SYSTEM =================
class ParticleSystem {
    constructor() {
        this.canvas = document.getElementById('particles-canvas');
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.resize();
        window.addEventListener('resize', () => this.resize());
        this.init();
        this.animate();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    init() {
        const count = Math.min(window.innerWidth / 10, 100);
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 2 + 1,
                speedX: (Math.random() - 0.5) * 0.5,
                speedY: (Math.random() - 0.5) * 0.5,
                opacity: Math.random() * 0.5 + 0.2
            });
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        const primary = getComputedStyle(document.body).getPropertyValue('--primary').trim();

        this.particles.forEach(p => {
            p.x += p.speedX;
            p.y += p.speedY;

            if (p.x < 0 || p.x > this.canvas.width) p.speedX *= -1;
            if (p.y < 0 || p.y > this.canvas.height) p.speedY *= -1;

            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fillStyle = primary;
            this.ctx.globalAlpha = p.opacity;
            this.ctx.fill();
        });

        // Draw connections
        this.particles.forEach((p1, i) => {
            this.particles.slice(i + 1).forEach(p2 => {
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 150) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(p1.x, p1.y);
                    this.ctx.lineTo(p2.x, p2.y);
                    this.ctx.strokeStyle = primary;
                    this.ctx.globalAlpha = 0.1 * (1 - dist / 150);
                    this.ctx.stroke();
                }
            });
        });

        this.ctx.globalAlpha = 1;
        requestAnimationFrame(() => this.animate());
    }
}

// ================= THEME SYSTEM =================
function loadTheme(themeId) {
    document.body.className = `theme-${themeId}`;
    currentTheme = themeId;
    localStorage.setItem('theme', themeId);
}

function renderThemeSelector() {
    const container = document.getElementById('theme-grid');
    if (!container || !allThemes.length) return;

    container.innerHTML = allThemes.map(theme => `
        <div class="theme-card ${theme.id === currentTheme ? 'active' : ''}" data-theme="${theme.id}" onclick="selectTheme('${theme.id}')">
            <div class="theme-preview" style="background: linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.secondary});"></div>
            <div class="theme-name">${theme.name}</div>
        </div>
    `).join('');
}

function selectTheme(themeId) {
    loadTheme(themeId);
    renderThemeSelector();

    if (!IS_DEMO && API_URL) {
        fetch(`${API_URL}/api/admin/settings`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${adminToken}`
            },
            body: JSON.stringify({ currentTheme: themeId })
        }).catch(() => {});
    }

    showStatus('Theme changed successfully!', 'success');
}

// ================= API FUNCTIONS =================
async function fetchProjects() {
    if (IS_DEMO) {
        allProjects = DEMO_PROJECTS;
        return DEMO_PROJECTS;
    }
    try {
        const res = await fetch(`${API_URL}/api/projects`);
        const data = await res.json();
        allProjects = data;
        return data;
    } catch (e) {
        console.error('Failed to fetch projects:', e);
        allProjects = DEMO_PROJECTS;
        return DEMO_PROJECTS;
    }
}

async function fetchSettings() {
    if (IS_DEMO) {
        settings = DEMO_SETTINGS;
        return DEMO_SETTINGS;
    }
    try {
        const res = await fetch(`${API_URL}/api/settings`);
        const data = await res.json();
        settings = data;
        return data;
    } catch (e) {
        console.error('Failed to fetch settings:', e);
        settings = DEMO_SETTINGS;
        return DEMO_SETTINGS;
    }
}

async function fetchThemes() {
    if (IS_DEMO) {
        allThemes = [
            { id: "cyberpunk", name: "Cyberpunk Neon", colors: { primary: "#00f0ff", secondary: "#ff00a0" } },
            { id: "dark-elegant", name: "Dark Elegant", colors: { primary: "#c9a96e", secondary: "#8b7355" } },
            { id: "ocean-blue", name: "Ocean Blue", colors: { primary: "#00d4ff", secondary: "#0099cc" } },
            { id: "purple-dream", name: "Purple Dream", colors: { primary: "#b347d9", secondary: "#7c3aed" } },
            { id: "emerald-green", name: "Emerald Green", colors: { primary: "#00ff88", secondary: "#00cc6a" } },
            { id: "sunset-orange", name: "Sunset Orange", colors: { primary: "#ff6b35", secondary: "#f7931e" } },
            { id: "cherry-red", name: "Cherry Red", colors: { primary: "#ff0040", secondary: "#cc0033" } },
            { id: "golden-luxury", name: "Golden Luxury", colors: { primary: "#ffd700", secondary: "#c5a000" } },
            { id: "midnight-blue", name: "Midnight Blue", colors: { primary: "#4fc3f7", secondary: "#29b6f6" } },
            { id: "matrix-green", name: "Matrix Green", colors: { primary: "#39ff14", secondary: "#00cc00" } },
            { id: "pink-rose", name: "Pink Rose", colors: { primary: "#ff69b4", secondary: "#ff1493" } },
            { id: "ice-white", name: "Ice White", colors: { primary: "#e0e0e0", secondary: "#b0b0b0" } },
            { id: "fire-red", name: "Fire Red", colors: { primary: "#ff4500", secondary: "#cc3700" } },
            { id: "neon-yellow", name: "Neon Yellow", colors: { primary: "#ffff00", secondary: "#cccc00" } },
            { id: "aqua-teal", name: "Aqua Teal", colors: { primary: "#00ffff", secondary: "#00cccc" } },
            { id: "lavender", name: "Lavender", colors: { primary: "#e6e6fa", secondary: "#b8b8d1" } },
            { id: "coral", name: "Coral", colors: { primary: "#ff7f50", secondary: "#e86c3a" } },
            { id: "mint", name: "Mint Fresh", colors: { primary: "#98ff98", secondary: "#7de87d" } },
            { id: "silver-tech", name: "Silver Tech", colors: { primary: "#c0c0c0", secondary: "#a0a0a0" } },
            { id: "ruby", name: "Ruby", colors: { primary: "#e0115f", secondary: "#b30d4b" } },
            { id: "sapphire", name: "Sapphire", colors: { primary: "#0f52ba", secondary: "#0a3d8f" } },
            { id: "amethyst", name: "Amethyst", colors: { primary: "#9966cc", secondary: "#7a4fb5" } },
            { id: "turquoise", name: "Turquoise", colors: { primary: "#40e0d0", secondary: "#30b8aa" } },
            { id: "crimson", name: "Crimson", colors: { primary: "#dc143c", secondary: "#b01030" } },
            { id: "neon-orange", name: "Neon Orange", colors: { primary: "#ff6600", secondary: "#cc5200" } },
            { id: "platinum", name: "Platinum", colors: { primary: "#e5e4e2", secondary: "#c0bfbd" } },
            { id: "jade", name: "Jade", colors: { primary: "#00a86b", secondary: "#008655" } },
            { id: "amber", name: "Amber", colors: { primary: "#ffbf00", secondary: "#cc9900" } },
            { id: "electric-violet", name: "Electric Violet", colors: { primary: "#8f00ff", secondary: "#7200cc" } },
            { id: "rainbow", name: "Rainbow", colors: { primary: "#ff0000", secondary: "#00ff00" } },
            { id: "ghost-white", name: "Ghost White", colors: { primary: "#f8f8ff", secondary: "#d0d0e0" } }
        ];
        return allThemes;
    }
    try {
        const res = await fetch(`${API_URL}/api/themes`);
        const data = await res.json();
        allThemes = data;
        return data;
    } catch (e) {
        return [];
    }
}

// ================= RENDER FUNCTIONS =================
function renderProjects() {
    const container = document.getElementById('projects-grid');
    if (!container) return;

    if (!allProjects.length) {
        container.innerHTML = '<p style="text-align:center;color:var(--text-muted)">No projects yet. Add from admin panel.</p>';
        return;
    }

    container.innerHTML = allProjects.map(project => {
        const bannerUrl = project.banner && project.banner.startsWith('/') 
            ? `${API_URL}${project.banner}` 
            : project.banner;
        return `
            <a href="${project.link}" target="_blank" class="project-card" data-id="${project.id}">
                <img src="${bannerUrl}" alt="${project.title}" class="project-banner" loading="lazy" onerror="this.src='https://via.placeholder.com/800x400?text=${encodeURIComponent(project.title)}'">
                <div class="project-info">
                    <span class="project-category">${project.category || 'General'}</span>
                    <h3 class="project-title">${project.title}</h3>
                    <div class="project-link">View Project &rarr;</div>
                </div>
            </a>
        `;
    }).join('');
}

function renderAdminProjects() {
    const container = document.getElementById('admin-projects-list');
    if (!container) return;

    if (!allProjects.length) {
        container.innerHTML = '<p style="color:var(--text-muted);text-align:center">No projects yet.</p>';
        return;
    }

    container.innerHTML = allProjects.map(project => {
        const bannerUrl = project.banner && project.banner.startsWith('/') 
            ? `${API_URL}${project.banner}` 
            : project.banner;
        return `
            <div class="admin-project-item">
                <img src="${bannerUrl}" alt="${project.title}" class="admin-project-img" onerror="this.style.display='none'">
                <div class="admin-project-info">
                    <h4>${project.title}</h4>
                    <p>${project.link}</p>
                </div>
                <button class="btn-danger" onclick="deleteProject('${project.id}')">Delete</button>
            </div>
        `;
    }).join('');
}

function updateSiteContent() {
    // Update site name
    const siteNameEl = document.getElementById('site-name');
    const footerNameEl = document.getElementById('footer-name');
    const logoEl = document.getElementById('logo');
    if (siteNameEl) siteNameEl.textContent = settings.siteName || 'Shadow Official';
    if (footerNameEl) footerNameEl.textContent = settings.siteName || 'Shadow Official';
    if (logoEl) logoEl.textContent = settings.siteName || 'Shadow Official';

    // Update about section
    const aboutNameEl = document.getElementById('about-name');
    const aboutTitleEl = document.getElementById('about-title');
    const aboutDescEl = document.getElementById('about-desc');
    const aboutAvatarEl = document.getElementById('about-avatar');
    const aboutLocationEl = document.getElementById('about-location');

    if (settings.about) {
        if (aboutNameEl) aboutNameEl.textContent = settings.about.name || 'Shadow Developer';
        if (aboutTitleEl) aboutTitleEl.textContent = settings.about.title || 'Full Stack Developer';
        if (aboutDescEl) aboutDescEl.textContent = settings.about.description || '';
        if (aboutAvatarEl && settings.about.avatar) aboutAvatarEl.src = settings.about.avatar;
        if (aboutLocationEl) aboutLocationEl.textContent = settings.about.location || 'Pakistan';
    }

    // Update social links
    if (settings.social) {
        const waEl = document.getElementById('social-whatsapp');
        const tgEl = document.getElementById('social-telegram');
        const waChEl = document.getElementById('social-whatsapp-channel');
        const tgChEl = document.getElementById('social-telegram-channel');
        const ytEl = document.getElementById('social-youtube');

        if (waEl) {
            waEl.href = `https://wa.me/${(settings.social.whatsapp || '').replace(/\D/g, '')}`;
            waEl.querySelector('.social-handle').textContent = settings.social.whatsapp || '+92-XXX-XXXXXXX';
        }
        if (tgEl) {
            tgEl.href = `https://t.me/${(settings.social.telegram || '').replace('@', '')}`;
            tgEl.querySelector('.social-handle').textContent = settings.social.telegram || '@shadowofficial';
        }
        if (waChEl) {
            waChEl.href = settings.social.whatsappChannel || '#';
            waChEl.querySelector('.social-handle').textContent = 'WhatsApp Channel';
        }
        if (tgChEl) {
            tgChEl.href = settings.social.telegramChannel || '#';
            tgChEl.querySelector('.social-handle').textContent = 'Telegram Channel';
        }
        if (ytEl) {
            ytEl.href = settings.social.youtube || '#';
            ytEl.querySelector('.social-handle').textContent = 'YouTube Channel';
        }
    }

    // Load theme
    if (settings.currentTheme) {
        loadTheme(settings.currentTheme);
    }
}

// ================= ADMIN PANEL =================
function openAdmin() {
    document.getElementById('admin-overlay').classList.add('active');
    document.body.style.overflow = 'hidden';

    if (adminToken) {
        showAdminPanel();
    } else {
        showAdminLogin();
    }
}

function closeAdmin() {
    document.getElementById('admin-overlay').classList.remove('active');
    document.body.style.overflow = '';
}

function showAdminLogin() {
    document.getElementById('admin-login').style.display = 'block';
    document.getElementById('admin-dashboard').style.display = 'none';
}

function showAdminPanel() {
    document.getElementById('admin-login').style.display = 'none';
    document.getElementById('admin-dashboard').style.display = 'flex';
    renderAdminProjects();
    renderThemeSelector();
    loadAdminSettings();
}

async function adminLogin() {
    const password = document.getElementById('admin-password').value;
    const errorEl = document.getElementById('login-error');

    if (!password) {
        errorEl.textContent = 'Please enter password';
        errorEl.style.display = 'block';
        return;
    }

    if (IS_DEMO) {
        if (password === 'r749926n') {
            adminToken = 'demo-token';
            localStorage.setItem('adminToken', adminToken);
            showAdminPanel();
        } else {
            errorEl.textContent = 'Invalid password!';
            errorEl.style.display = 'block';
        }
        return;
    }

    try {
        const res = await fetch(`${API_URL}/api/admin/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password })
        });

        const data = await res.json();

        if (data.success) {
            adminToken = data.token;
            localStorage.setItem('adminToken', adminToken);
            errorEl.style.display = 'none';
            showAdminPanel();
        } else {
            errorEl.textContent = data.error || 'Invalid password!';
            errorEl.style.display = 'block';
        }
    } catch (e) {
        errorEl.textContent = 'Connection failed. Check backend URL.';
        errorEl.style.display = 'block';
    }
}

function adminLogout() {
    adminToken = '';
    localStorage.removeItem('adminToken');
    showAdminLogin();
}

async function addProject() {
    const title = document.getElementById('project-title').value;
    const link = document.getElementById('project-link').value;
    const category = document.getElementById('project-category').value;
    const fileInput = document.getElementById('project-banner');
    const bannerUrl = document.getElementById('banner-url').value;

    if (!title || !link) {
        showStatus('Title and link are required!', 'error');
        return;
    }

    if (IS_DEMO) {
        showStatus('Demo mode: Cannot add projects. Connect backend first.', 'error');
        return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('link', link);
    formData.append('category', category);

    if (fileInput.files[0]) {
        formData.append('banner', fileInput.files[0]);
    } else if (bannerUrl) {
        formData.append('bannerUrl', bannerUrl);
    }

    try {
        const res = await fetch(`${API_URL}/api/admin/projects`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${adminToken}` },
            body: formData
        });

        const data = await res.json();

        if (data.id) {
            showStatus('Project added successfully!', 'success');
            document.getElementById('project-title').value = '';
            document.getElementById('project-link').value = '';
            document.getElementById('project-category').value = '';
            document.getElementById('project-banner').value = '';
            document.getElementById('banner-url').value = '';
            document.getElementById('preview-image').style.display = 'none';

            await fetchProjects();
            renderProjects();
            renderAdminProjects();
        } else {
            showStatus(data.error || 'Failed to add project', 'error');
        }
    } catch (e) {
        showStatus('Connection failed', 'error');
    }
}

async function deleteProject(id) {
    if (!confirm('Are you sure you want to delete this project?')) return;

    if (IS_DEMO) {
        showStatus('Demo mode: Cannot delete projects', 'error');
        return;
    }

    try {
        const res = await fetch(`${API_URL}/api/admin/projects/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${adminToken}` }
        });

        const data = await res.json();

        if (data.success) {
            showStatus('Project deleted!', 'success');
            await fetchProjects();
            renderProjects();
            renderAdminProjects();
        } else {
            showStatus(data.error || 'Failed to delete', 'error');
        }
    } catch (e) {
        showStatus('Connection failed', 'error');
    }
}

async function updateSettings() {
    const siteName = document.getElementById('setting-site-name').value;
    const aboutName = document.getElementById('setting-about-name').value;
    const aboutTitle = document.getElementById('setting-about-title').value;
    const aboutDesc = document.getElementById('setting-about-desc').value;
    const aboutLocation = document.getElementById('setting-about-location').value;
    const aboutEmail = document.getElementById('setting-about-email').value;
    const whatsapp = document.getElementById('setting-whatsapp').value;
    const telegram = document.getElementById('setting-telegram').value;
    const waChannel = document.getElementById('setting-whatsapp-channel').value;
    const tgChannel = document.getElementById('setting-telegram-channel').value;
    const youtube = document.getElementById('setting-youtube').value;

    const newSettings = {
        siteName,
        about: {
            name: aboutName,
            title: aboutTitle,
            description: aboutDesc,
            location: aboutLocation,
            email: aboutEmail
        },
        social: {
            whatsapp,
            telegram,
            whatsappChannel: waChannel,
            telegramChannel: tgChannel,
            youtube
        }
    };

    if (IS_DEMO) {
        settings = { ...settings, ...newSettings };
        updateSiteContent();
        showStatus('Settings updated! (Demo mode)', 'success');
        return;
    }

    try {
        const res = await fetch(`${API_URL}/api/admin/settings`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${adminToken}`
            },
            body: JSON.stringify(newSettings)
        });

        const data = await res.json();

        if (data.success) {
            showStatus('Settings updated!', 'success');
            await fetchSettings();
            updateSiteContent();
        } else {
            showStatus(data.error || 'Failed to update', 'error');
        }
    } catch (e) {
        showStatus('Connection failed', 'error');
    }
}

async function changePassword() {
    const current = document.getElementById('current-password').value;
    const newPass = document.getElementById('new-password').value;
    const confirm = document.getElementById('confirm-password').value;

    if (!current || !newPass || !confirm) {
        showStatus('All fields required', 'error');
        return;
    }

    if (newPass !== confirm) {
        showStatus('New passwords do not match', 'error');
        return;
    }

    if (IS_DEMO) {
        showStatus('Demo mode: Password cannot be changed', 'error');
        return;
    }

    try {
        const res = await fetch(`${API_URL}/api/admin/password`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${adminToken}`
            },
            body: JSON.stringify({ currentPassword: current, newPassword: newPass })
        });

        const data = await res.json();

        if (data.success) {
            showStatus('Password changed!', 'success');
            document.getElementById('current-password').value = '';
            document.getElementById('new-password').value = '';
            document.getElementById('confirm-password').value = '';
        } else {
            showStatus(data.error || 'Failed to change', 'error');
        }
    } catch (e) {
        showStatus('Connection failed', 'error');
    }
}

function loadAdminSettings() {
    if (!settings) return;

    document.getElementById('setting-site-name').value = settings.siteName || 'Shadow Official';
    if (settings.about) {
        document.getElementById('setting-about-name').value = settings.about.name || '';
        document.getElementById('setting-about-title').value = settings.about.title || '';
        document.getElementById('setting-about-desc').value = settings.about.description || '';
        document.getElementById('setting-about-location').value = settings.about.location || '';
        document.getElementById('setting-about-email').value = settings.about.email || '';
    }
    if (settings.social) {
        document.getElementById('setting-whatsapp').value = settings.social.whatsapp || '';
        document.getElementById('setting-telegram').value = settings.social.telegram || '';
        document.getElementById('setting-whatsapp-channel').value = settings.social.whatsappChannel || '';
        document.getElementById('setting-telegram-channel').value = settings.social.telegramChannel || '';
        document.getElementById('setting-youtube').value = settings.social.youtube || '';
    }
}

// ================= TAB SWITCHING =================
function switchTab(tab) {
    document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.admin-section').forEach(s => s.classList.remove('active'));

    document.querySelector(`[data-tab="${tab}"]`).classList.add('active');
    document.getElementById(`section-${tab}`).classList.add('active');
}

// ================= UTILITY =================
function showStatus(message, type) {
    const el = document.getElementById('status-msg');
    el.textContent = message;
    el.className = `status-msg ${type}`;
    setTimeout(() => { el.className = 'status-msg'; }, 4000);
}

function previewBanner() {
    const fileInput = document.getElementById('project-banner');
    const preview = document.getElementById('preview-image');
    const urlInput = document.getElementById('banner-url');

    if (fileInput.files && fileInput.files[0]) {
        const reader = new FileReader();
        reader.onload = (e) => {
            preview.src = e.target.result;
            preview.style.display = 'block';
        };
        reader.readAsDataURL(fileInput.files[0]);
    } else if (urlInput.value) {
        preview.src = urlInput.value;
        preview.style.display = 'block';
    }
}

// ================= MOBILE MENU =================
function toggleMobileMenu() {
    document.getElementById('nav-links').classList.toggle('active');
}

// ================= SCROLL ANIMATIONS =================
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.project-card, .social-card, .stat-card').forEach(el => {
        observer.observe(el);
    });
}

// ================= INIT =================
async function init() {
    // Init particles
    new ParticleSystem();

    // Fetch data
    await Promise.all([fetchProjects(), fetchSettings(), fetchThemes()]);

    // Render
    updateSiteContent();
    renderProjects();
    renderThemeSelector();

    // Init animations
    initScrollAnimations();

    // Hide loading
    setTimeout(() => {
        document.getElementById('loading-screen').classList.add('hidden');
    }, 1000);
}

// Start
document.addEventListener('DOMContentLoaded', init);
