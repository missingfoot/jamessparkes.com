import { initGallery } from '../js/gallery.js';
import { PortfolioDetailModal } from './PortfolioDetailModal.js';

function createPortfolioItem(project) {
    const imagesHtml = project.images.map(img => 
        `<img src="${img.src}" alt="${img.alt}" class="w-full flex-shrink-0">`
    ).join('');

    const tagsHtml = project.tags.map(tag =>
        `<span class="px-3 py-1 bg-black/5 dark:bg-white/10 text-gray-700 dark:text-gray-300 rounded-global text-sm">${tag}</span>`
    ).join('');

    return `
        <!-- Instagram-like post module -->
        <div class="rounded-none sm:rounded-2xl shadow-none sm:shadow-light-2xl dark:sm:shadow-2xl w-full mb-4 sm:mb-8 sm:surface sm:bg-surface-light sm:dark:bg-surface-dark">
            <!-- Post header -->
            <div class="p-4 sm:p-6">
                <div class="flex items-center">
                    <img src="${project.logo}" alt="${project.company} Logo" class="w-10 h-10 rounded-full mr-3">
                    <div>
                        <h2 class="font-normal text-gray-800 dark:text-gray-200">${project.title}</h2>
                        <p class="text-sm text-gray-600 dark:text-gray-400">${project.company}, ${project.location}</p>
                    </div>
                </div>
            </div>
            <!-- Image gallery -->
            <div data-gallery="${project.id}">
                <div data-gallery-container="${project.id}">
                    <div data-gallery-images="${project.id}" class="flex transition-transform duration-300 ease-in-out">
                        ${imagesHtml}
                    </div>
                </div>
                <!-- Navigation buttons and pagination -->
                <div class="flex justify-between items-center py-4 px-4 sm:px-6">
                    <div class="text-gray-800 dark:text-gray-200" data-pagination="${project.id}"></div>
                    <div class="flex items-center space-x-2">
                        <button class="bg-black dark:bg-white rounded-global p-2" data-prev="${project.id}" title="Previous image">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white dark:text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <button class="bg-black dark:bg-white rounded-global p-2" data-next="${project.id}" title="Next image">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white dark:text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
            <!-- Post content -->
            <div class="p-4 sm:p-6">
                <p class="text-gray-800 dark:text-gray-200 mb-4">${project.description}</p>
                <a href="#" class="group inline-block text-gray-700 dark:text-white underline hover:text-gray-900 dark:hover:text-gray-200 transition-colors duration-300 cursor-pointer mb-6" data-portfolio-detail="${project.id}">
                    <span class="inline-block transform group-hover:-translate-y-0.5 transition-transform duration-150">Read Case Study</span>
                </a>
                <div class="flex flex-wrap gap-2">
                    ${tagsHtml}
                </div>
            </div>
        </div>
    `;
}

export function Portfolio() {
    return `
        <div id="portfolio-container"></div>
        ${PortfolioDetailModal()}
    `;
}

// Initialize portfolio after DOM content is loaded
document.addEventListener('DOMContentLoaded', () => {
    const portfolioContainer = document.getElementById('portfolio-container');
    if (!portfolioContainer) return;

    fetch('/data/portfolio.json')
        .then(response => response.json())
        .then(data => {
            portfolioContainer.innerHTML = data.projects.map(project => createPortfolioItem(project)).join('');
            // Initialize galleries after content is loaded
            data.projects.forEach(project => {
                initGallery(project.id);
            });
        })
        .catch(error => {
            console.error('Error loading portfolio data:', error);
            portfolioContainer.innerHTML = '<p class="text-red-500">Error loading portfolio items</p>';
        });
}); 