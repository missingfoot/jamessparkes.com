// components/Viewer.js
import { renderAbout } from './views/AboutView.js';
import { renderCV } from './views/CVView.js';
import { renderProject } from './views/ProjectView.js';

export function renderViewer(container) {
    container.innerHTML = `
        <button class="viewer-back" data-viewer-back>← back</button>
        <div class="viewer-content"></div>
    `;

    container.querySelector('[data-viewer-back]').addEventListener('click', () => {
        document.body.classList.remove('viewer-open');
    });

    window.addEventListener('selection-change', e => {
        container.scrollTop = 0;
        const content = container.querySelector('.viewer-content');
        content.innerHTML = '';
        const { type, id } = e.detail;
        if (type === 'about') renderAbout(content);
        else if (type === 'cv') renderCV(content);
        else if (type === 'project') renderProject(content, id);
    });
}
