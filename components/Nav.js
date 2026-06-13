// components/Nav.js
import { navigate, getSelection } from '../js/router.js';
import { toggleTheme, getTheme } from '../js/theme.js';

export async function renderNav(container) {
    const { projects } = await fetch('data/portfolio.json').then(r => r.json());
    const visible = projects
        .filter(p => p.visible)
        .sort((a, b) => a.order - b.order);

    container.innerHTML = buildHTML(visible, getTheme());
    bindEvents(container, visible);
    updateActive(container);

    window.addEventListener('selection-change', () => updateActive(container));
    document.addEventListener('theme-change', e => {
        const label = container.querySelector('.theme-label');
        if (label) label.textContent = e.detail.theme === 'dark' ? 'light' : 'dark';
    });
}

function buildHTML(projects, currentTheme) {
    const themeLabel = currentTheme === 'dark' ? 'light' : 'dark';
    return `
        <div class="nav-name">James Sparkes</div>
        <div class="nav-role">Product Designer</div>
        <nav class="nav-groups">
            <div class="nav-group">
                <div class="nav-group-header">Info</div>
                <button class="nav-item" data-nav-type="about">About</button>
                <button class="nav-item" data-nav-type="cv">CV</button>
            </div>
            <div class="nav-group">
                <div class="nav-group-header">Work</div>
                ${projects.map(p => `
                    <button class="nav-item" data-nav-type="project" data-nav-id="${p.id}">${escapeHTML(p.title)}</button>
                `).join('')}
            </div>
        </nav>
        <button class="nav-theme-toggle" data-theme-toggle>
            <span class="theme-label">${themeLabel}</span>
        </button>
    `;
}

function bindEvents(container, projects) {
    container.addEventListener('click', e => {
        if (e.target.closest('[data-theme-toggle]')) {
            toggleTheme();
            return;
        }
        const item = e.target.closest('[data-nav-type]');
        if (!item) return;
        const type = item.dataset.navType;
        const id = item.dataset.navId ? parseInt(item.dataset.navId, 10) : null;
        navigate(type, id);
        document.body.classList.add('viewer-open');
    });
}

function escapeHTML(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function updateActive(container) {
    const sel = getSelection();
    if (!sel) return;
    container.querySelectorAll('[data-nav-type]').forEach(el => {
        const typeMatch = el.dataset.navType === sel.type;
        const idMatch = sel.type !== 'project' || parseInt(el.dataset.navId, 10) === sel.id;
        el.classList.toggle('active', typeMatch && idMatch);
    });
}
