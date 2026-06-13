// components/views/CVView.js
export function renderCV(container) {
    container.innerHTML = `
        <div class="cv-view">
            <a class="cv-download" href="James_Sparkes_CV.pdf" download>download ↓</a>
            <iframe
                class="cv-frame"
                src="James_Sparkes_CV.pdf"
                title="James Sparkes CV"
            ></iframe>
        </div>
    `;
}
