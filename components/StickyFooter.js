// StickyFooter.js
export function StickyFooter() {
    return `
        <!-- Sticky footer for mobile -->
        <div id="stickyFooter" class="sticky-footer p-4 w-full sm:hidden surface bg-surface-light dark:bg-surface-dark z-[1000] shadow-[0_-2px_10px_rgba(0,0,0,0.05)] dark:shadow-[0_-2px_10px_rgba(0,0,0,0.2)]">
            <a href="https://www.jamessparkes.com/James_Sparkes_CV.pdf" target="_blank" rel="noopener noreferrer" class="block w-full text-center px-4 py-3 bg-black dark:bg-white text-white dark:text-black rounded-global hover:bg-gray-800 dark:hover:bg-gray-200 transition duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 inline-block mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                <span class="font-medium hover:font-medium transition-all duration-300">Download CV</span>
            </a>
        </div>
    `;
} 