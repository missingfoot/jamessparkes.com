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
        const isMobile = window.innerWidth < 640; // sm breakpoint
        
        // Reset all transitions and transforms
        content.style.transition = 'transform 0.3s ease-out';
        background.style.transition = 'opacity 0.3s ease-out';
        
        // Ensure modal starts from correct position based on viewport
        if (isMobile) {
            content.style.transform = 'translateY(100%)';
        } else {
            content.style.transform = 'translateX(100%)';
        }
        
        background.classList.remove('opacity-100');
        background.style.opacity = '0';
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
        const cvContent = document.getElementById('cvContent');
        const isMobile = window.innerWidth < 640;
        
        // Force a fresh content state by cloning and replacing
        if (cvContent) {
            const freshContent = cvContent.cloneNode(true);
            cvContent.parentNode.replaceChild(freshContent, cvContent);
        }
        
        // Update status bar to match modal background
        const metaStatusBar = document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]');
        if (metaStatusBar) {
            metaStatusBar.setAttribute('content', 'black');
        }
        
        // First make modal visible but in starting position
        cvModal.classList.remove('hidden');
        prepareModalForOpen();
        
        // Then trigger the animation after a brief delay
        requestAnimationFrame(() => {
            const content = cvModal.querySelector('#cvModalContent');
            const background = cvModal.querySelector('#cvModalBackground');
            
            // Reset transform to show the modal
            content.style.transform = 'translate(0, 0)';
            background.classList.add('opacity-100');
            background.style.opacity = '1';
        });
    }

    function closeModal() {
        const cvModal = document.getElementById('cvModal');
        const background = cvModal.querySelector('#cvModalBackground');
        const content = cvModal.querySelector('#cvModalContent');
        const isMobile = window.innerWidth < 640;
        
        // Reset transitions for smooth closing
        content.style.transition = 'transform 0.3s ease-out';
        background.style.transition = 'opacity 0.3s ease-out';
        
        background.classList.remove('opacity-100');
        
        // Set the appropriate transform based on viewport
        if (isMobile) {
            content.style.transform = 'translateY(100%)';
        } else {
            content.style.transform = 'translateX(100%)';
        }
        background.style.opacity = '0';
        
        // Reset status bar to theme-based style
        const isDark = document.documentElement.classList.contains('dark');
        const metaStatusBar = document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]');
        if (metaStatusBar) {
            metaStatusBar.setAttribute('content', isDark ? 'black-translucent' : 'default');
        }
        
        setTimeout(() => {
            cvModal.classList.add('hidden');
            resetDragState();
        }, 300);
    }

    // Common function to handle drag start
    function handleDragStart(clientY, event) {
        const cvModal = document.getElementById('cvModal');
        const cvModalContent = document.getElementById('cvModalContent');
        const cvContent = document.getElementById('cvContent');
        const isMobile = window.innerWidth < 640;
        
        if (cvModal.classList.contains('hidden') || !isMobile) return false;
        
        // Store initial scroll position
        initialScrollTop = cvContent.scrollTop;
        
        // Check if we're touching the puller or its container
        const isTouchingPuller = event?.target.closest('.puller') || event?.target.classList.contains('puller');
        
        // Only allow dragging if touching the puller
        if (isTouchingPuller) {
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
        
        return false;
    }

    // Common function to handle drag move
    function handleDragMove(clientY, event) {
        if (!isDragging) return;
        
        const cvModalContent = document.getElementById('cvModalContent');
        const deltaY = clientY - startY;
        
        // Only allow dragging downwards and reset if trying to drag upwards
        if (deltaY < 0) {
            currentTranslateY = 0;
            cvModalContent.style.transform = '';
            return;
        }

        // Always prevent default when dragging
        event?.preventDefault();
        
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
            // Only dismiss if we've dragged a significant amount
            if (currentTranslateY > 20) {
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
                // Snap back if the drag was too small
                snapBack();
            }
        } else {
            snapBack();
        }
    }

    function snapBack() {
        const cvModalContent = document.getElementById('cvModalContent');
        cvModalContent.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        cvModalContent.style.transform = '';
        document.getElementById('cvModalBackground').style.opacity = 1;
        setTimeout(() => {
            resetDragState();
        }, 300);
    }

    // Touch event handlers
    document.addEventListener('touchstart', (e) => {
        const cvModal = document.getElementById('cvModal');
        if (cvModal.classList.contains('hidden')) return;
        
        // Store the touch position for later comparison
        lastDragY = e.touches[0].clientY;
        
        if (handleDragStart(e.touches[0].clientY, e)) {
            // Only prevent default if we're actually starting a drag
            if (e.target.closest('.puller')) {
                e.preventDefault();
            }
        }
    }, { passive: false });

    document.addEventListener('touchmove', (e) => {
        const cvModal = document.getElementById('cvModal');
        const cvContent = document.getElementById('cvContent');
        const isMobile = window.innerWidth < 640;
        
        // Early return if modal is hidden or on desktop
        if (cvModal.classList.contains('hidden') || !isMobile) return;
        
        // If we're not dragging, let the content scroll normally
        if (!isDragging) {
            return;
        }
        
        // Handle dragging if active
        handleDragMove(e.touches[0].clientY, e);
    }, { passive: false });

    document.addEventListener('touchend', () => {
        handleDragEnd();
    }, { passive: false });

    // Mouse event handlers (for desktop testing)
    document.addEventListener('mousedown', (e) => {
        const cvModal = document.getElementById('cvModal');
        if (cvModal.classList.contains('hidden')) return;
        
        if (handleDragStart(e.clientY, e)) {
            // Prevent text selection while dragging
            e.preventDefault();
        }
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            e.preventDefault();
            handleDragMove(e.clientY, e);
        }
    });

    document.addEventListener('mouseup', () => {
        if (isDragging) {
            console.log('Drag end');
            handleDragEnd();
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