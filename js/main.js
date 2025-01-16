// main.js
import { initTheme, toggleTheme } from './theme.js';
import { initCVModal } from './cvModal.js';
import { initPortfolioModal } from './portfolioModal.js';

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

// Initialize contact link
export function initEmailContact() {
    const originalParts = ['Y29t', 'a2VzLg==', 'c3Bhcg==', 'bWVz', 'QGph', 'bGlv', 'dGZv', 'cG9y'];
    
    const contactLink = document.getElementById('contactLink');
    if (contactLink) {
        contactLink.addEventListener('click', (e) => {
            const email = [...originalParts].map(part => atob(part)).reverse().join('');
            contactLink.href = `mailto:${email}?subject=${encodeURIComponent('Portfolio Enquiry')}`;
        });
    }
}

// Re-export modal functions
export { initCVModal, initPortfolioModal }; 