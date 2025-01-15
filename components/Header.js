// Header.js
export function Header() {
    return `
        <!-- Theme toggle button for both mobile and desktop -->
        <button data-theme-toggle class="p-2 absolute top-4 right-4 sm:top-10 sm:right-10 text-gray-800 dark:text-gray-200 hover:text-gray-600 dark:hover:text-gray-400 transition-colors duration-300" aria-label="Toggle theme">
            <svg data-theme-toggle xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path data-theme-toggle stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
        </button>
        <!-- Header section with name, title, and theme toggle -->
        <div class="flex flex-col items-start">
            <!-- Avatar for mobile -->
            <div class="flex justify-between items-center w-full mb-2 sm:hidden">
                <div id="avatarContainer" class="relative">
                    <img id="avatarImage" src="images/avatar.jpeg" alt="James Sparkes" class="w-20 h-20 rounded-full object-cover">
                </div>
            </div>
            <!-- Lightbox -->
            <div id="lightbox">
                <img id="lightboxImage" src="images/avatar.jpeg" alt="James Sparkes">
            </div>
            <!-- Desktop layout -->
            <div class="hidden sm:flex sm:flex-row sm:justify-between sm:items-center sm:w-full">
                <div class="flex items-center">
                    <img src="images/avatar.jpeg" alt="James Sparkes" class="w-16 h-16 rounded-full mr-4 object-cover">
                    <div class="text-left">
                        <h1 class="text-3xl font-normal text-gray-800 dark:text-gray-200">James Sparkes</h1>
                        <h2 class="text-lg text-gray-600 dark:text-gray-400 mt-1">Product Designer</h2>
                    </div>
                </div>
            </div>
            <!-- Name and title for mobile, under the avatar -->
            <div class="text-left sm:hidden mt-2">
                <h1 class="text-3xl font-normal text-gray-800 dark:text-gray-200">James Sparkes</h1>
            </div>
        </div>
    `;
} 