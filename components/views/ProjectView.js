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

    let caseStudyHTML = '';
    if (project.caseStudyFile) {
        const htmlFile = project.caseStudyFile.replace(/\.md$/, '.html');
        try {
            const res = await fetch(`case-studies/${htmlFile}`);
            if (res.ok) caseStudyHTML = stripFrontMatter(await res.text());
        } catch (_) {
            // no case study file — silently skip
        }
    }

    const sel2 = getSelection();
    if (!sel2 || sel2.type !== 'project' || sel2.id !== projectId) return;

    const thumbsHTML = project.images
        .map(img => `
            <div class="project-thumb" data-full="${escapeAttr(img.src)}">
                <img src="${escapeAttr(img.src)}" alt="${escapeAttr(img.alt)}" loading="lazy">
            </div>`)
        .join('');

    const tagsHTML = project.tags
        .map(t => `<span>${escapeHTML(t)}</span>`)
        .join('');

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

function stripFrontMatter(html) {
    const hrIdx = html.indexOf('<hr');
    if (hrIdx === -1) return html;
    const afterHr = html.indexOf('>', hrIdx) + 1;
    return html.slice(afterHr).trim();
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
