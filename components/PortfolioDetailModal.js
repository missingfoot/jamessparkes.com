export function PortfolioDetailModal() {
    return `
        <div id="portfolioDetailModal" class="fixed inset-0 z-[1001] hidden">
            <div id="portfolioModalBackground" class="absolute inset-0 bg-black bg-opacity-50 opacity-0 transition-opacity duration-300"></div>
            <div id="portfolioModalContent" class="absolute bottom-0 sm:right-8 sm:bottom-8 sm:top-8 bg-primary-light dark:bg-primary-dark rounded-t-xl sm:rounded-xl transform translate-y-full sm:translate-x-[100%] transition-transform duration-300 h-[90vh] sm:h-[calc(100vh-4rem)] sm:max-w-[560px] w-full flex flex-col">
                <!-- Close button (desktop only) -->
                <button class="hidden sm:flex absolute top-4 right-4 p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors duration-300" id="closePortfolioModalButton">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                <!-- Puller (only for mobile) -->
                <div class="flex justify-center pt-3 pb-4 cursor-grab active:cursor-grabbing puller sm:hidden">
                    <div class="w-10 h-1 bg-gray-400 dark:bg-gray-500 rounded-full"></div>
                </div>
                <!-- Portfolio detail content -->
                <div id="portfolioContent" class="flex-grow overflow-y-auto p-4 sm:p-10 text-gray-800 dark:text-gray-200">
                    <!-- Content will be dynamically inserted here -->
                </div>
                <!-- Close link (mobile only) -->
                <div class="sm:hidden p-4 flex justify-center">
                    <a href="#" id="closePortfolioModalButton" class="inline-block text-gray-700 dark:text-white underline hover:text-gray-900 dark:hover:text-gray-200 transition duration-300 cursor-pointer">
                        Close
                    </a>
                </div>
            </div>
        </div>
    `;
} 