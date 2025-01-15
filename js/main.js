// main.js
import { initTheme, toggleTheme } from './theme.js';

// Sticky Footer functionality
export function initStickyFooter() {
    const stickyFooter = document.getElementById('stickyFooter');
    let scrollThreshold = 300;

    function handleScroll() {
        if (window.scrollY > scrollThreshold) {
            stickyFooter?.classList.add('visible');
        } else {
            stickyFooter?.classList.remove('visible');
        }
    }

    window.addEventListener('scroll', handleScroll);

    // Function to set scroll threshold
    window.setScrollThreshold = function(threshold) {
        scrollThreshold = threshold;
    }

    // Function to set scroll threshold as a percentage of page height
    window.setScrollThresholdPercentage = function(percentage) {
        const pageHeight = document.documentElement.scrollHeight - window.innerHeight;
        scrollThreshold = (percentage / 100) * pageHeight;
    }
}

// CV Modal functionality
export function initCVModal() {
    // Add click event listener using event delegation
    document.addEventListener('click', (e) => {
        const cvLink = e.target.closest('#cvLink');
        const closeModalButton = e.target.closest('#closeModalButton');
        const cvModalBackground = e.target.closest('#cvModalBackground');
        const cvModal = document.getElementById('cvModal');
        const cvModalContent = document.getElementById('cvModalContent');

        if (cvLink) {
            e.preventDefault();
            openModal();
        }

        if (closeModalButton || cvModalBackground) {
            closeModal();
        }

        function openModal() {
            cvModal.classList.remove('hidden');
            setTimeout(() => {
                cvModal.querySelector('#cvModalBackground').classList.add('opacity-100');
                cvModal.querySelector('#cvModalContent').classList.remove('translate-y-full');
            }, 10);
        }

        function closeModal() {
            const background = cvModal.querySelector('#cvModalBackground');
            const content = cvModal.querySelector('#cvModalContent');
            
            background.classList.remove('opacity-100');
            content.classList.add('translate-y-full');
            setTimeout(() => {
                cvModal.classList.add('hidden');
            }, 300);
        }
    });

    // Close modal on escape key press
    document.addEventListener('keydown', function(e) {
        const cvModal = document.getElementById('cvModal');
        if (e.key === 'Escape' && cvModal && !cvModal.classList.contains('hidden')) {
            closeModal();
        }
    });
} 