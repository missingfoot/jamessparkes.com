// Bio.js
export function Bio() {
    return `
        <div id="bio-container" class="text-gray-800 dark:text-gray-200 mt-6">
            <div id="bio-description" class="text-gray-600 dark:text-gray-400 space-y-4 relative">
                <div class="bio-content line-clamp space-y-4"></div>
                <button id="bio-toggle" class="group text-gray-700 dark:text-white underline hover:text-gray-900 dark:hover:text-gray-200 transition-colors duration-150 mt-2 hidden">
                    <span class="inline-block transform group-hover:-translate-y-0.5 transition-transform duration-150">Read more</span>
                </button>
            </div>
        </div>
    `;
}

// Initialize bio after DOM content is loaded
document.addEventListener('DOMContentLoaded', () => {
    const bioDescription = document.getElementById('bio-description');
    const bioContent = bioDescription?.querySelector('.bio-content');
    const bioToggle = document.getElementById('bio-toggle');
    if (!bioDescription || !bioContent || !bioToggle) return;

    fetch('/data/bio.json')
        .then(response => response.json())
        .then(data => {
            // Split the description into paragraphs and create paragraph elements
            const paragraphs = data.description.split('\n\n');
            const content = paragraphs.map(text => `<p>${text}</p>`).join('');
            bioContent.innerHTML = content;

            // Get the line clamp value from the data or default to 3
            const lineClamp = data.maxLines || 3;
            bioContent.style.setProperty('--max-lines', lineClamp);
            bioContent.classList.add('line-clamp-active');

            // Check if content is truncated
            const isTruncated = bioContent.scrollHeight > bioContent.clientHeight;
            if (isTruncated) {
                bioToggle.classList.remove('hidden');
                bioToggle.addEventListener('click', () => {
                    if (bioContent.classList.contains('line-clamp-active')) {
                        bioContent.classList.remove('line-clamp-active');
                        const span = bioToggle.querySelector('span');
                        span.textContent = 'Show less';
                    } else {
                        bioContent.classList.add('line-clamp-active');
                        const span = bioToggle.querySelector('span');
                        span.textContent = 'Read more';
                    }
                });
            }
        })
        .catch(error => {
            console.error('Error loading bio data:', error);
            bioContent.textContent = 'Error loading bio information';
        });
});

// Add styles to the document
const style = document.createElement('style');
style.textContent = `
    .line-clamp {
        display: -webkit-box;
        -webkit-box-orient: vertical;
        overflow: hidden;
        transition: all 0.3s ease;
    }
    .line-clamp-active {
        -webkit-line-clamp: var(--max-lines, 3);
    }
`;
document.head.appendChild(style);