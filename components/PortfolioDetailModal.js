export function PortfolioDetailModal() {
    return `
        <div id="portfolioDetailModal" class="portfolio-modal hidden">
            <div id="portfolioModalBackground" class="portfolio-modal-background"></div>
            <div id="portfolioModalContent" class="portfolio-modal-content bg-surface-light dark:bg-surface-dark">
                <!-- Desktop controls -->
                <div class="hidden sm:flex absolute top-4 right-4 gap-2">
                    <!-- Maximize button -->
                    <button class="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors duration-300" id="maximizePortfolioModalButton">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3"/><path d="M21 8V5a2 2 0 0 0-2-2h-3"/><path d="M3 16v3a2 2 0 0 0 2 2h3"/><path d="M16 21h3a2 2 0 0 0 2-2v-3"/></svg>
                    </button>
                    <!-- Close button -->
                    <button class="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors duration-300" id="closePortfolioModalButton">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <!-- Add bookmark list here at same level as desktop controls -->
                <div class="bookmark-list" id="bookmarkList">
                    <div class="bookmark-list-inner">
                        <p class="level-1">Overview</p>
                        <p class="level-2">Tasks & responsibilities</p>
                        <p class="level-2">Project: Customer messaging platform</p>
                        <p class="level-3">The Challenge</p>
                        <p class="level-3">Our Approach</p>
                    </div>
                </div>
                <!-- Puller (only for mobile) -->
                <div class="portfolio-modal-puller">
                    <div class="portfolio-modal-puller-line bg-gray-400 dark:bg-gray-500"></div>
                </div>
                <!-- Portfolio content -->
                <div id="portfolioContent" class="portfolio-modal-content-inner text-gray-800 dark:text-gray-200">
                    <div class="modal-content-wrapper">
                        <div class="markdown-content" id="markdownContent">
                            <!-- Content will be dynamically inserted here -->
                        </div>
                    </div>
                </div>
            </div>
            <!-- Floating close button (mobile only) -->
            <button class="portfolio-modal-close-mobile sm:hidden bg-black dark:bg-white" id="closePortfolioModalButtonMobile">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white dark:text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span class="text-white dark:text-black">Close</span>
            </button>
        </div>
    `;
} 