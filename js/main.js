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
    let startY = 0;
    let startTranslateY = 0;
    let currentTranslateY = 0;
    let isDragging = false;
    let lastDragTime = 0;
    let lastDragY = 0;
    let dragVelocity = 0;
    let initialScrollTop = 0;
    const DISMISS_THRESHOLD = 150; // pixels to drag down before dismissing
    const DRAG_RESISTANCE = 1.5; // Higher number = more resistance
    const VELOCITY_THRESHOLD = 0.5; // Velocity needed to trigger momentum dismiss

    function resetDragState() {
        startY = 0;
        startTranslateY = 0;
        currentTranslateY = 0;
        isDragging = false;
        dragVelocity = 0;
        initialScrollTop = 0;
        const cvModalContent = document.getElementById('cvModalContent');
        if (cvModalContent) {
            cvModalContent.style.transform = '';
            cvModalContent.style.transition = 'transform 0.3s ease-out';
        }
    }

    function prepareModalForOpen() {
        const cvModal = document.getElementById('cvModal');
        const content = cvModal.querySelector('#cvModalContent');
        const background = cvModal.querySelector('#cvModalBackground');
        
        // Reset all transitions and transforms
        content.style.transition = 'transform 0.3s ease-out';
        background.style.transition = 'opacity 0.3s ease-out';
        
        // Ensure modal starts from bottom
        content.classList.add('translate-y-full');
        background.classList.remove('opacity-100');
        background.style.opacity = '0';
        
        // Clear any lingering inline styles
        content.style.transform = '';
    }

    // Add click event listener using event delegation
    document.addEventListener('click', (e) => {
        const cvLink = e.target.closest('#cvLink');
        const closeModalButton = e.target.closest('#closeModalButton');
        const cvModalBackground = e.target.closest('#cvModalBackground');
        const cvModal = document.getElementById('cvModal');

        if (cvLink) {
            e.preventDefault();
            openModal();
        }

        if (closeModalButton || cvModalBackground) {
            closeModal();
        }
    });

    function openModal() {
        resetDragState();
        const cvModal = document.getElementById('cvModal');
        
        // First make modal visible but in starting position
        cvModal.classList.remove('hidden');
        prepareModalForOpen();
        
        // Then trigger the animation after a brief delay
        requestAnimationFrame(() => {
            const content = cvModal.querySelector('#cvModalContent');
            const background = cvModal.querySelector('#cvModalBackground');
            
            content.classList.remove('translate-y-full');
            background.classList.add('opacity-100');
            background.style.opacity = '1';
        });
    }

    function closeModal() {
        const cvModal = document.getElementById('cvModal');
        const background = cvModal.querySelector('#cvModalBackground');
        const content = cvModal.querySelector('#cvModalContent');
        
        // Reset transitions for smooth closing
        content.style.transition = 'transform 0.3s ease-out';
        background.style.transition = 'opacity 0.3s ease-out';
        
        background.classList.remove('opacity-100');
        content.classList.add('translate-y-full');
        background.style.opacity = '0';
        
        setTimeout(() => {
            cvModal.classList.add('hidden');
            resetDragState();
            prepareModalForOpen(); // Prepare for next opening
        }, 300);
    }

    // Common function to handle drag start
    function handleDragStart(clientY) {
        const cvModal = document.getElementById('cvModal');
        const cvModalContent = document.getElementById('cvModalContent');
        const cvContent = document.getElementById('cvContent');
        
        if (cvModal.classList.contains('hidden')) return false;
        
        // Store initial scroll position
        initialScrollTop = cvContent.scrollTop;
        
        // Only initiate drag if:
        // 1. Touching the puller element, OR
        // 2. At the top of the content (scrollTop === 0)
        const isTouchingPuller = event.target.closest('.w-10.h-1.bg-gray-400');
        const isAtTop = cvContent.scrollTop <= 0;
        
        if (!isTouchingPuller && !isAtTop) {
            return false;
        }

        startY = clientY;
        lastDragY = clientY;
        lastDragTime = Date.now();
        isDragging = true;
        startTranslateY = currentTranslateY;
        dragVelocity = 0;

        // Remove transition while dragging
        cvModalContent.style.transition = 'none';
        return true;
    }

    // Common function to handle drag move
    function handleDragMove(clientY) {
        if (!isDragging) return;
        
        const cvModalContent = document.getElementById('cvModalContent');
        const cvContent = document.getElementById('cvContent');
        const deltaY = clientY - startY;
        
        // If we started dragging from the content (not the puller)
        // and we're not at the top anymore, cancel the drag
        const isTouchingPuller = event.target.closest('.w-10.h-1.bg-gray-400');
        if (!isTouchingPuller && cvContent.scrollTop > 0) {
            isDragging = false;
            resetDragState();
            return;
        }
        
        // Only allow dragging downwards
        if (deltaY < 0) {
            isDragging = false;
            resetDragState();
            return;
        }

        // Prevent default scroll behavior while dragging
        event.preventDefault();
        
        const currentTime = Date.now();
        const deltaTime = currentTime - lastDragTime;
        if (deltaTime > 0) {
            dragVelocity = (clientY - lastDragY) / deltaTime;
        }
        lastDragTime = currentTime;
        lastDragY = clientY;

        // Apply resistance to the drag
        currentTranslateY = startTranslateY + (deltaY / DRAG_RESISTANCE);
        
        // Update modal position
        cvModalContent.style.transform = `translateY(${currentTranslateY}px)`;
        
        // Update background opacity
        const progress = Math.min(currentTranslateY / DISMISS_THRESHOLD, 1);
        const opacity = 1 - progress;
        document.getElementById('cvModalBackground').style.opacity = opacity;
    }

    // Common function to handle drag end
    function handleDragEnd() {
        if (!isDragging) return;
        
        isDragging = false;
        const cvModalContent = document.getElementById('cvModalContent');
        const cvModal = document.getElementById('cvModal');
        const background = cvModal.querySelector('#cvModalBackground');
        
        // Calculate final velocity-based position
        const shouldDismissVelocity = dragVelocity > VELOCITY_THRESHOLD;
        const shouldDismissDistance = currentTranslateY > DISMISS_THRESHOLD;
        
        if (shouldDismissVelocity || shouldDismissDistance) {
            // Momentum-based dismissal
            const finalTranslateY = window.innerHeight;
            const duration = shouldDismissVelocity ? 300 : 400; // Faster if flicked
            
            cvModalContent.style.transition = `transform ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`;
            background.style.transition = `opacity ${duration}ms ease-out`;
            
            cvModalContent.style.transform = `translateY(${finalTranslateY}px)`;
            background.style.opacity = '0';
            
            setTimeout(() => {
                cvModal.classList.add('hidden');
                resetDragState();
            }, duration);
        } else {
            // Snap back
            cvModalContent.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
            cvModalContent.style.transform = '';
            document.getElementById('cvModalBackground').style.opacity = 1;
            setTimeout(() => {
                resetDragState();
            }, 300);
        }
    }

    // Touch event handlers
    document.addEventListener('touchstart', (e) => {
        if (handleDragStart(e.touches[0].clientY)) {
            // Only prevent default if we're actually starting a drag
            if (event.target.closest('.w-10.h-1.bg-gray-400')) {
                e.preventDefault();
            }
        }
    }, { passive: false });

    document.addEventListener('touchmove', (e) => {
        if (isDragging) {
            handleDragMove(e.touches[0].clientY);
        }
    }, { passive: false });

    document.addEventListener('touchend', () => {
        handleDragEnd();
    }, { passive: false });

    // Mouse event handlers (for desktop testing)
    document.addEventListener('mousedown', (e) => {
        if (handleDragStart(e.clientY)) {
            // Only prevent default if we're actually starting a drag
            if (event.target.closest('.w-10.h-1.bg-gray-400')) {
                e.preventDefault();
            }
        }
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            handleDragMove(e.clientY);
        }
    });

    document.addEventListener('mouseup', () => {
        handleDragEnd();
    });

    // Close modal on escape key press
    document.addEventListener('keydown', function(e) {
        const cvModal = document.getElementById('cvModal');
        if (e.key === 'Escape' && cvModal && !cvModal.classList.contains('hidden')) {
            closeModal();
        }
    });
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