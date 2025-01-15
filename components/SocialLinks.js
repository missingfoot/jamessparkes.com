// SocialLinks.js
export function SocialLinks() {
    return `
        <!-- Social links section -->
        <div class="mt-6 flex flex-wrap gap-4">
            <!-- LinkedIn -->
            <a href="https://uk.linkedin.com/in/jamessparkesdesign" target="_blank" rel="noopener noreferrer" class="group relative text-gray-700 dark:text-white hover:text-gray-900 dark:hover:text-gray-200 underline transition-all duration-300 cursor-pointer">
                <span class="inline-block transition-transform duration-300 group-hover:translate-y-[-2px]">LinkedIn</span>
            </a>
            <!-- Contact -->
            <a href="mailto:" id="contactLink" class="group relative text-gray-700 dark:text-white hover:text-gray-900 dark:hover:text-gray-200 underline transition-all duration-300 cursor-pointer">
                <span class="inline-block transition-transform duration-300 group-hover:translate-y-[-2px]">Contact</span>
            </a>
            <!-- View CV -->
            <a href="#" id="cvLink" class="sm:hidden group relative text-gray-700 dark:text-white hover:text-gray-900 dark:hover:text-gray-200 underline transition-all duration-300 cursor-pointer">
                <span class="inline-block transition-transform duration-300 group-hover:translate-y-[-2px]">View CV</span>
            </a>
            <!-- Download CV -->
            <a href="https://jamessparkes.s3.eu-west-1.amazonaws.com/James_Sparkes_CV.pdf" target="_blank" rel="noopener noreferrer" class="hidden sm:inline-block group relative text-gray-700 dark:text-white hover:text-gray-900 dark:hover:text-gray-200 underline transition-all duration-300 cursor-pointer">
                <span class="inline-block transition-transform duration-300 group-hover:translate-y-[-2px]">Download CV</span>
            </a>
        </div>
    `;
} 