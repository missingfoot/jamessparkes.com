document.addEventListener('DOMContentLoaded', function() {
    // Theme toggle functionality
    const themeToggle = document.getElementById('themeToggle');
    const html = document.documentElement;

    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        html.classList.toggle('dark', savedTheme === 'dark');
    } else {
        // If no saved preference, check system preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        html.classList.toggle('dark', prefersDark);
    }

    // Toggle theme on button click
    themeToggle.addEventListener('click', () => {
        html.classList.toggle('dark');
        updateThemeToggleIcon();
        // Save theme preference
        localStorage.setItem('theme', html.classList.contains('dark') ? 'dark' : 'light');
        updateStatusBarColor();
    });

    // Update theme toggle icon based on current theme
    function updateThemeToggleIcon() {
        const isDark = html.classList.contains('dark');
        themeToggle.innerHTML = isDark ?
            '<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>' :
            '<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>';
    }

    // Initialize theme toggle icon
    updateThemeToggleIcon();

    // Read more functionality
    const maxWords = 50; // Set the number of words to show initially

    // Function to truncate text
    function truncateText(element, maxWords) {
        const text = element.textContent;
        const words = text.split(' ');
        if (words.length > maxWords) {
            const truncated = words.slice(0, maxWords).join(' ') + '...';
            element.textContent = truncated;
            element.dataset.fullText = text;
            return true;
        }
        return false;
    }

    // Apply read more functionality to all posts
    document.querySelectorAll('.read-more').forEach(button => {
        const content = button.previousElementSibling.querySelector('#postContent');
        const isTruncated = truncateText(content, maxWords);

        if (!isTruncated) {
            button.style.display = 'none';
        } else {
            button.addEventListener('click', () => {
                if (content.dataset.fullText) {
                    content.textContent = content.dataset.fullText;
                    button.textContent = 'Read less';
                    delete content.dataset.fullText;
                } else {
                    truncateText(content, maxWords);
                    button.textContent = 'Read more';
                }
            });
        }
    });

    // Function to pad a number with a leading zero if it's less than 10
    function padNumber(number) {
        return number < 10 ? `0${number}` : number;
    }

    // Surface and status bar functionality
    const surfacesEnabled = tailwind.config.surfaces;
    const surfaceElements = document.querySelectorAll('.surface');

    surfaceElements.forEach(element => {
        if (surfacesEnabled) {
            element.classList.add('bg-surface-light', 'dark:bg-surface-dark');
        } else {
            element.classList.remove('bg-surface-light', 'dark:bg-surface-dark');
        }
    });

    function updateStatusBarColor() {
        const isDarkMode = document.documentElement.classList.contains('dark');
        const metaTag = document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]');

        if (isDarkMode) {
            metaTag.setAttribute('content', 'black');
        } else {
            metaTag.setAttribute('content', 'default');
        }
    }

    // Initial status bar color update
    updateStatusBarColor();

    // Avatar animation
    document.addEventListener('DOMContentLoaded', function() {
        const avatarContainer = document.getElementById('avatarContainer');
        const avatarImage = document.getElementById('avatarImage');
        let isExpanded = false;

        function toggleAvatarSize() {
            isExpanded = !isExpanded;
            if (isExpanded) {
                avatarImage.style.transform = 'scale(2.5)';
                avatarImage.style.zIndex = '10';
                avatarContainer.style.zIndex = '10';
            } else {
                avatarImage.style.transform = 'scale(1)';
                avatarImage.style.zIndex = '1';
                avatarContainer.style.zIndex = '1';
            }
        }

        avatarContainer.addEventListener('click', function() {
            toggleAvatarSize();
        });
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const avatarContainer = document.getElementById('avatarContainer');
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    const avatarImage = document.getElementById('avatarImage');
    let isExpanded = false;

    /**
     * Opens the lightbox for the avatar image.
     * Adds 'active' class to lightbox, disables body scrolling,
     * and adjusts padding for iOS status bar if in standalone mode.
     */
    function openLightbox() {
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
        if (navigator.standalone) {
            document.documentElement.style.paddingTop = '20px'; // Adjust for iOS status bar
        }
    }

    /**
     * Closes the lightbox.
     * Removes 'active' class from lightbox, re-enables body scrolling,
     * and resets padding if in standalone mode.
     */
    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
        if (navigator.standalone) {
            document.documentElement.style.paddingTop = '0'; // Reset padding
        }
    }

    function toggleAvatarSize() {
        isExpanded = !isExpanded;
        if (isExpanded) {
            avatarImage.style.transform = 'scale(2.5)';
            avatarImage.style.zIndex = '10';
            avatarContainer.style.zIndex = '10';
        } else {
            avatarImage.style.transform = 'scale(1)';
            avatarImage.style.zIndex = '1';
            avatarContainer.style.zIndex = '1';
        }
    }

    avatarContainer.addEventListener('click', function() {
        if (window.innerWidth >= 640) { // sm breakpoint
            toggleAvatarSize();
        } else {
            openLightbox();
        }
    });

    lightbox.addEventListener('click', closeLightbox);

    // Allow closing when clicking on the image itself
    lightboxImage.addEventListener('click', function(e) {
        e.stopPropagation(); // Prevent immediate propagation
        closeLightbox();
    });

    // CV Modal functionality
    const cvLink = document.getElementById('cvLink');
    const cvModal = document.getElementById('cvModal');
    const modalBackground = document.getElementById('cvModalBackground');
    const modalContent = document.getElementById('cvModalContent');
    const cvContent = document.getElementById('cvContent');

    let startY, currentY;
    let isDragging = false;
    let isScrollingUp = false;

    function openModal() {
        cvModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';

        // Reset scroll position
        cvContent.scrollTop = 0;

        requestAnimationFrame(() => {
            modalBackground.style.opacity = '0';
            modalContent.style.transform = 'translateY(100%)';

            requestAnimationFrame(() => {
                modalBackground.style.transition = 'opacity 0.3s ease-out';
                modalBackground.style.opacity = '1';

                modalContent.style.transition = 'transform 0.3s ease-out';
                modalContent.style.transform = 'translateY(0)';
            });
        });
    }

    function closeModal() {
        modalBackground.style.transition = 'opacity 0.3s ease-out';
        modalBackground.style.opacity = '0';

        modalContent.style.transition = 'transform 0.3s ease-out';
        modalContent.style.transform = 'translateY(100%)';

        setTimeout(() => {
            cvModal.classList.add('hidden');
            document.body.style.overflow = '';
            modalContent.style.transition = '';
            modalContent.style.transform = '';
        }, 300);
    }

    cvLink.addEventListener('click', function(e) {
        e.preventDefault();
        openModal();
    });

    modalBackground.addEventListener('click', closeModal);

    modalContent.addEventListener('touchstart', function(e) {
        startY = e.touches[0].clientY;
        isDragging = true;
        isScrollingUp = false;
        modalContent.style.transition = 'none';
    });

    modalContent.addEventListener('touchmove', function(e) {
        if (!isDragging) return;
        currentY = e.touches[0].clientY;
        const diffY = currentY - startY;

        // Check if we're at the top of the content and trying to scroll up
        if (cvContent.scrollTop === 0 && diffY > 0) {
            e.preventDefault();
            const progress = diffY / modalContent.offsetHeight;
            modalContent.style.transform = `translateY(${diffY}px)`;
            modalBackground.style.opacity = 1 - progress;
        } else if (cvContent.scrollHeight - cvContent.scrollTop === cvContent.clientHeight && diffY < 0) {
            // We're at the bottom of the content and trying to scroll down
            isScrollingUp = true;
        } else {
            // We're scrolling within the content
            isDragging = false;
        }
    });

    modalContent.addEventListener('touchend', function(e) {
        if (!isDragging && !isScrollingUp) return;
        isDragging = false;
        isScrollingUp = false;
        const diffY = currentY - startY;
        const threshold = modalContent.offsetHeight * 0.2;

        if (diffY > threshold && !isScrollingUp) {
            closeModal();
        } else {
            modalContent.style.transition = 'transform 0.3s ease-out';
            modalContent.style.transform = 'translateY(0)';
            modalBackground.style.transition = 'opacity 0.3s ease-out';
            modalBackground.style.opacity = '1';
        }
    });

    // Add this new line to get the close button
    const closeModalButton = document.getElementById('closeModalButton');

    // Add this new event listener for the close button
    closeModalButton.addEventListener('click', closeModal);
});