// SocialLinks.js
export function SocialLinks() {
    return `
        <!-- Social links section -->
        <div class="mt-6 flex flex-wrap gap-4">
            <!-- LinkedIn -->
            <a href="https://uk.linkedin.com/in/jamessparkesdesign" target="_blank" rel="noopener noreferrer" class="text-gray-700 dark:text-white underline hover:text-gray-900 dark:hover:text-gray-200 transition duration-300 cursor-pointer">
                LinkedIn
            </a>
            <!-- GitHub -->
            <a href="https://github.com/jamessparkes" target="_blank" rel="noopener noreferrer" class="text-gray-700 dark:text-white underline hover:text-gray-900 dark:hover:text-gray-200 transition duration-300 cursor-pointer">
                GitHub
            </a>
            <!-- Contact -->
            <a href="mailto:" id="contactLink" class="text-gray-700 dark:text-white underline hover:text-gray-900 dark:hover:text-gray-200 transition duration-300 cursor-pointer">
                Contact
            </a>
            <!-- View CV -->
            <a href="#" id="cvLink" class="sm:hidden text-gray-700 dark:text-white underline hover:text-gray-900 dark:hover:text-gray-200 transition duration-300 cursor-pointer">
                View CV
            </a>
            <!-- Download CV -->
            <a href="https://jamessparkes.s3.eu-west-1.amazonaws.com/James_Sparkes_CV.pdf" target="_blank" rel="noopener noreferrer" class="hidden sm:inline-block text-gray-700 dark:text-white underline hover:text-gray-900 dark:hover:text-gray-200 transition duration-300 cursor-pointer">
                Download CV
            </a>
        </div>
    `;
} 