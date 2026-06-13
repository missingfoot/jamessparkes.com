// components/views/ProjectView.js
import { getSelection } from '../../js/router.js';

export async function renderProject(container, projectId) {
    const { projects } = await fetch('data/portfolio.json').then(r => r.json());

    const sel = getSelection();
    if (!sel || sel.type !== 'project' || sel.id !== projectId) return;

    const project = projects.find(p => p.id === projectId);
    if (!project) {
        container.innerHTML = '<p style="color:var(--text-dim)">Project not found.</p>';
        return;
    }

    const thumbsHTML = project.images
        .map(img => `
            <div class="project-thumb" data-full="${escapeAttr(img.src)}">
                <img src="${escapeAttr(img.src)}" alt="${escapeAttr(img.alt)}" loading="lazy">
            </div>`)
        .join('');

    const tagsHTML = project.tags
        .map(t => `<span>${escapeHTML(t)}</span>`)
        .join('');

    const caseStudyHTML = project.caseStudy ? renderBlocks(project.caseStudy) : '';

    container.innerHTML = `
        <div class="project-view">
            <h1 class="project-title">${escapeHTML(project.title)}</h1>
            <div class="project-tags">${tagsHTML}</div>
            <p class="project-description">${escapeHTML(project.description)}</p>
            <div class="project-images">${thumbsHTML}</div>
            ${caseStudyHTML ? `<div class="project-case-study">${caseStudyHTML}</div>` : ''}
        </div>
    `;

    initHoverPreview(container);
}

function renderBlocks(blocks) {
    return blocks.map(b => {
        if (b.type === 'h1' || b.type === 'h2') return `<h2>${escapeHTML(b.text)}</h2>`;
        if (b.type === 'h3' || b.type === 'h4') return `<h3>${escapeHTML(b.text)}</h3>`;
        if (b.type === 'p') return `<p>${escapeHTML(b.text)}</p>`;
        if (b.type === 'ul') return `<ul>${b.items.map(i => `<li>${escapeHTML(i)}</li>`).join('')}</ul>`;
        if (b.type === 'ol') return `<ol>${b.items.map(i => `<li>${escapeHTML(i)}</li>`).join('')}</ol>`;
        return '';
    }).join('\n');
}

function initHoverPreview(container) {
    const preview = document.createElement('div');
    preview.className = 'image-preview-float';
    const previewImg = document.createElement('img');
    preview.appendChild(previewImg);
    document.body.appendChild(preview);

    function reposition(e) {
        const pad = 16;
        const pw = preview.offsetWidth;
        const ph = preview.offsetHeight;
        const x = e.clientX + pad + pw > window.innerWidth
            ? e.clientX - pw - pad
            : e.clientX + pad;
        const y = e.clientY + pad + ph > window.innerHeight
            ? e.clientY - ph - pad
            : e.clientY + pad;
        preview.style.left = x + 'px';
        preview.style.top = y + 'px';
    }

    container.querySelectorAll('.project-thumb').forEach(thumb => {
        thumb.addEventListener('mouseenter', e => {
            previewImg.src = thumb.dataset.full;
            preview.classList.add('visible');
            reposition(e);
        });
        thumb.addEventListener('mousemove', reposition);
        thumb.addEventListener('mouseleave', () => {
            preview.classList.remove('visible');
        });
    });

    // Clean up preview element when a new project is selected
    window.addEventListener('selection-change', () => preview.remove(), { once: true });
}

function escapeHTML(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function escapeAttr(str) {
    return String(str).replace(/"/g, '&quot;');
}
