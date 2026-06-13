// components/views/AboutView.js
export async function renderAbout(container) {
    const { description } = await fetch('data/bio.json').then(r => r.json());
    container.innerHTML = `
        <div class="about-view">
            <p class="about-bio">${escapeHTML(description)}</p>
            <div class="about-links">
                <a href="https://uk.linkedin.com/in/jamessparkesdesign" target="_blank" rel="noopener noreferrer">LinkedIn</a>
                <a href="mailto:hello@jamessparkes.com" id="contact-link">Contact</a>
            </div>
        </div>
    `;
}

function escapeHTML(str) {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}
