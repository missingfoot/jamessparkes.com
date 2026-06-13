// components/views/ProjectView.js
export async function renderProject(container, projectId) {
    const { projects } = await fetch('data/portfolio.json').then(r => r.json());
    const project = projects.find(p => p.id === projectId);
    if (!project) {
        container.innerHTML = '<p style="color:var(--text-dim)">Project not found.</p>';
        return;
    }

    let caseStudyHTML = '';
    if (project.caseStudyFile) {
        const htmlFile = project.caseStudyFile.replace(/\.md$/, '.html');
        try {
            caseStudyHTML = await fetch(`case-studies/${htmlFile}`).then(r => r.text());
        } catch (_) {
            // no case study file — silently skip
        }
    }

    const imagesHTML = project.images
        .map(img => `<img src="${img.src}" alt="${escapeAttr(img.alt)}" loading="lazy">`)
        .join('');

    const tagsHTML = project.tags
        .map(t => `<span>${escapeHTML(t)}</span>`)
        .join('');

    container.innerHTML = `
        <div class="project-view">
            <h1 class="project-title">${escapeHTML(project.title)}</h1>
            <div class="project-tags">${tagsHTML}</div>
            <p class="project-description">${escapeHTML(project.description)}</p>
            <div class="project-images">${imagesHTML}</div>
            ${caseStudyHTML ? `<div class="project-case-study">${caseStudyHTML}</div>` : ''}
        </div>
    `;
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
