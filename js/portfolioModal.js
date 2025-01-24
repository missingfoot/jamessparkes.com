// Portfolio Modal functionality
export function initPortfolioModal() {
    let startY = 0;
    let startTranslateY = 0;
    let currentTranslateY = 0;
    let isDragging = false;
    let lastDragTime = 0;
    let lastDragY = 0;
    let dragVelocity = 0;
    let initialScrollTop = 0;
    const DISMISS_THRESHOLD = 150;
    const DRAG_RESISTANCE = 1.5;
    const VELOCITY_THRESHOLD = 0.5;
    let peakTranslateY = 0;

    // Cache for portfolio data
    let cachedPortfolioData = null;
    
    // Track last opened case study and scroll position
    let lastOpenedProjectId = null;
    let lastScrollPosition = 0;

    // Add near the top of the file, after the existing state variables
    let isMaximized = false;

    function resetDragState() {
        startY = 0;
        startTranslateY = 0;
        currentTranslateY = 0;
        peakTranslateY = 0;
        isDragging = false;
        dragVelocity = 0;
        initialScrollTop = 0;
        window.lastDragDirection = undefined;
        window.dragDirectionHistory = [];
    }

    function prepareModalForOpen() {
        const portfolioModal = document.getElementById('portfolioDetailModal');
        const content = portfolioModal.querySelector('#portfolioModalContent');
        const background = portfolioModal.querySelector('#portfolioModalBackground');
        const isMobile = window.innerWidth < 640;
        
        content.style.transition = 'none';
        background.style.transition = 'none';
        
        if (isMobile) {
            content.style.transform = 'translateY(100%)';
        } else {
            content.style.transform = 'translateX(100%)';
        }
        
        background.style.opacity = '0';
    }

    // Function to convert project name to filename
    function getMarkdownFilename(project) {
        return project.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric chars with hyphens
            .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
            .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
    }

    // Add this function near the top of the file
    function setupVideoIntersectionObserver() {
        const options = {
            root: document.getElementById('portfolioContent'),
            rootMargin: '50px 0px',  // Start loading slightly before they come into view
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const video = entry.target;
                if (entry.isIntersecting) {
                    // Video is visible, start playing
                    video.play().catch(() => {
                        // Autoplay failed, not a critical error
                    });
                } else {
                    // Video is off screen, pause it
                    video.pause();
                    // Optionally reset the video position
                    video.currentTime = 0;
                }
            });
        }, options);

        // Observe all videos in the modal
        const videos = document.querySelectorAll('#portfolioContent video');
        videos.forEach(video => observer.observe(video));

        return observer;
    }

    // Helper function to format text with bold and links
    function formatText(text, isHeader = false) {
        let formatted = text;
        
        if (!isHeader) {
            formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<span class="font-semibold">$1</span>');
        }
        
        // Process videos with lazy loading
        formatted = formatted.replace(/!\[(.*?)\]\((.*?\.(mp4|webm|mov))\)/g,
            '<figure class="my-8">' +
                '<video src="/case-studies/img/$2" loading="lazy" playsinline muted class="rounded-lg w-full">' +
                    'Your browser does not support the video tag.' +
                '</video>' +
                '<figcaption class="mt-2 text-sm text-gray-600 dark:text-gray-400 text-center">$1</figcaption>' +
            '</figure>'
        );
        
        // Process images - use path relative to project root and add lightbox functionality
        formatted = formatted.replace(/!\[(.*?)\]\((.*?)\)/g, 
            '<figure class="my-8">' +
                '<img src="/case-studies/img/$2" alt="$1" class="rounded-lg w-full cursor-pointer case-study-image" onclick="event.stopPropagation(); document.querySelector(\'.case-study-lightbox\').classList.add(\'active\'); document.querySelector(\'.case-study-lightbox-image\').src = this.src;">' +
                '<figcaption class="mt-2 text-sm text-gray-600 dark:text-gray-400 text-center">$1</figcaption>' +
            '</figure>'
        );
        
        // Always process links
        formatted = formatted.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="group inline-block text-gray-700 dark:text-white underline hover:text-gray-900 dark:hover:text-gray-200 transition-colors duration-300"><span class="inline-block transform group-hover:-translate-y-0.5 transition-transform duration-150">$1</span></a>');
        
        return formatted;
    }

    // Function to parse markdown sections
    function parseMarkdown(markdown) {
        const sections = [];
        let currentSection = {
            title: '',  // Empty title for intro section
            headerLevel: 0,  // 0 indicates intro section
            content: ''
        };
        let inList = false;
        let hasContent = false;
        
        // Helper function to strip markdown from headers
        function stripHeaderMarkdown(text) {
            return text.replace(/\*\*(.*?)\*\*/g, '$1');
        }
        
        // Split markdown into lines and clean them
        const lines = markdown.split('\n').map(line => line.trimEnd());
        
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const nextLine = lines[i + 1] || '';
            hasContent = true;

            // Check for section headers (##, ###, or ####)
            if (line.match(/^#{1,4}\s/)) {
                if (currentSection.content || currentSection.title) {
                    sections.push(currentSection);
                }
                const headerLevel = line.match(/^(#{1,4})\s/)[1].length;
                const title = line.replace(/^#{1,4}\s/, '').trim();
                currentSection = {
                    title: stripHeaderMarkdown(title), // Strip markdown from header
                    headerLevel,
                    content: ''
                };
                inList = false;
            } else if (line.trim()) {
                // Handle horizontal divider
                if (line.trim() === '---') {
                    currentSection.content += '<hr class="my-8 border-t border-gray-300 dark:border-gray-700">';
                    continue;
                }

                // Handle bullet points
                if (line.trim().startsWith('- ')) {
                    if (!inList) {
                        currentSection.content += '<ul class="list-disc pl-6 space-y-2 mb-4">';
                        inList = true;
                    }
                    const listItemContent = formatText(line.substring(2).trim());
                    currentSection.content += `<li class="text-gray-800 dark:text-gray-200">${listItemContent}</li>`;
                } else {
                    if (inList) {
                        currentSection.content += '</ul>';
                        inList = false;
                    }
                    const formattedLine = formatText(line.trim());
                    
                    // Handle line breaks and paragraphs
                    if (nextLine.trim() === '') {
                        // End of paragraph, but only if line doesn't end with backslash
                        if (!line.trim().endsWith('\\')) {
                            currentSection.content += `<p>${formattedLine}</p>`;
                        } else {
                            // Remove the backslash and just add the line
                            currentSection.content += formattedLine.slice(0, -1);
                        }
                    } else if (nextLine.trim()) {
                        // Next line has content, add a line break
                        if (!line.trim().endsWith('\\')) {
                            currentSection.content += `${formattedLine}<br>`;
                        } else {
                            // Remove the backslash and just add the line
                            currentSection.content += formattedLine.slice(0, -1);
                        }
                    } else {
                        // Continue in same paragraph
                        if (!line.trim().endsWith('\\')) {
                            currentSection.content += formattedLine + ' ';
                        } else {
                            // Remove the backslash and just add the line
                            currentSection.content += formattedLine.slice(0, -1);
                        }
                    }
                }
            } else if (!line.trim() && inList) {
                currentSection.content += '</ul>';
                inList = false;
            }
        }
        
        if (inList) {
            currentSection.content += '</ul>';
        }
        
        // If we have content but no sections were created, wrap everything in the current section
        if (hasContent && sections.length === 0 && currentSection.content) {
            sections.push(currentSection);
        }
        // If we have a final section with content, add it
        else if (currentSection.content || currentSection.title) {
            sections.push(currentSection);
        }
        
        // If we somehow ended up with no sections but had content, create a basic section
        if (sections.length === 0 && hasContent) {
            sections.push({
                title: '',
                headerLevel: 0,
                content: formatText(markdown)
            });
        }
        
        return sections;
    }

    // Update the wheel event handler
    document.addEventListener('wheel', (e) => {
        const portfolioModal = document.getElementById('portfolioDetailModal');
        if (portfolioModal.classList.contains('hidden')) return;

        const portfolioContent = document.getElementById('portfolioContent');
        const modalContent = document.getElementById('portfolioModalContent');

        // If modal is maximized, allow scrolling anywhere within the modal
        if (isMaximized && portfolioModal.contains(e.target)) {
            e.preventDefault(); // Prevent default scrolling
            
            // Get the scroll values
            const scrollTop = portfolioContent.scrollTop;
            const scrollHeight = portfolioContent.scrollHeight;
            const clientHeight = portfolioContent.clientHeight;
            
            // Calculate new scroll position
            const newScrollTop = scrollTop + e.deltaY;
            
            // Check if we can scroll in this direction
            if (newScrollTop >= 0 && newScrollTop <= (scrollHeight - clientHeight)) {
                portfolioContent.scrollTop = newScrollTop;
            }
            return;
        }

        // Original behavior for non-maximized state
        const target = e.target;
        if (portfolioContent.contains(target)) {
            const scrollTop = portfolioContent.scrollTop;
            const scrollHeight = portfolioContent.scrollHeight;
            const clientHeight = portfolioContent.clientHeight;

            if ((scrollTop === 0 && e.deltaY < 0) || 
                (scrollTop >= scrollHeight - clientHeight && e.deltaY > 0)) {
                e.preventDefault();
            }
        } else {
            // If we're not hovering over scrollable content, prevent scrolling
            e.preventDefault();
        }
    }, { passive: false });

    // Add click event listener using event delegation
    document.addEventListener('click', async (e) => {
        const portfolioDetailLink = e.target.closest('[data-portfolio-detail]');
        const closeModalButton = e.target.closest('#closePortfolioModalButton, #closePortfolioModalButtonMobile');
        const portfolioModalBackground = e.target.closest('#portfolioModalBackground');
        const portfolioModal = document.getElementById('portfolioDetailModal');

        if (portfolioDetailLink) {
            e.preventDefault();
            const projectId = portfolioDetailLink.dataset.portfolioDetail;
            loadCaseStudy(projectId);
        }

        if (closeModalButton || portfolioModalBackground) {
            e.preventDefault();
            closePortfolioModal();
        }
    });

    function openPortfolioModal(project) {
        resetDragState();
        const portfolioModal = document.getElementById('portfolioDetailModal');
        const portfolioContent = document.getElementById('portfolioContent');
        const content = portfolioModal.querySelector('#portfolioModalContent');
        const background = portfolioModal.querySelector('#portfolioModalBackground');
        const mobileCloseButton = portfolioModal.querySelector('#closePortfolioModalButtonMobile');
        const isMobile = window.innerWidth < 640;
        
        // Store current scroll position and lock scrolling
        document.documentElement.style.setProperty('--scroll-position', `-${window.scrollY}px`);
        document.body.classList.add('modal-open');
        
        // Update URL with clean path
        const casePath = project.caseStudyFile.replace('.md', '');
        const url = new URL(window.location.origin + '/' + casePath);
        history.pushState({}, '', url);
        
        // Remove hidden class and prepare modal
        portfolioModal.classList.remove('hidden');
        
        // Set initial state without transitions
        content.style.transition = 'none';
        background.style.transition = 'none';
        content.style.transform = isMobile ? 'translateY(100%)' : 'translate(-50%, 100%)';
        background.style.opacity = '0';
        
        // Add lightbox to modal if it doesn't exist
        if (!document.querySelector('.case-study-lightbox')) {
            const lightbox = document.createElement('div');
            lightbox.className = 'case-study-lightbox';
            lightbox.innerHTML = `
                <button class="case-study-lightbox-close">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                <div class="case-study-lightbox-container">
                    <img class="case-study-lightbox-image" src="" alt="">
                </div>
            `;
            document.body.appendChild(lightbox);
            
            let startY = 0;
            let currentY = 0;
            
            function handleLightboxDragStart(e) {
                const touch = e.touches ? e.touches[0] : e;
                startY = touch.clientY;
                isDragging = true;
                lightbox.querySelector('.case-study-lightbox-container').style.transition = 'none';
                lightbox.querySelector('.case-study-lightbox-image').style.transition = 'none';
                lightbox.querySelector('.case-study-lightbox-close').style.opacity = '0';
            }
            
            function handleLightboxDragMove(e) {
                if (!isDragging) return;
                const touch = e.touches ? e.touches[0] : e;
                currentY = touch.clientY;
                const deltaY = currentY - startY;
                
                const container = lightbox.querySelector('.case-study-lightbox-container');
                const image = lightbox.querySelector('.case-study-lightbox-image');
                
                container.style.transform = `translateY(${deltaY}px)`;
                
                // Scale and fade based on drag distance
                const scale = Math.max(0.8, 1 - Math.abs(deltaY) / 1000);
                const opacity = Math.max(0.5, 1 - Math.abs(deltaY) / DISMISS_THRESHOLD);
                image.style.transform = `scale(${scale})`;
                lightbox.style.backgroundColor = `rgba(0, 0, 0, ${opacity * 0.95})`;
                
                e.preventDefault();
                e.stopPropagation();
            }
            
            function handleLightboxDragEnd() {
                if (!isDragging) return;
                isDragging = false;
                
                const container = lightbox.querySelector('.case-study-lightbox-container');
                const image = lightbox.querySelector('.case-study-lightbox-image');
                const closeButton = lightbox.querySelector('.case-study-lightbox-close');
                const deltaY = currentY - startY;
                
                if (Math.abs(deltaY) > DISMISS_THRESHOLD) {
                    // Use the same fade animation for swipe dismissal
                    animateAndCloseLightbox(lightbox);
                } else {
                    // Snap back
                    container.style.transition = 'transform 0.3s ease-out';
                    image.style.transition = 'transform 0.3s ease-out';
                    lightbox.style.transition = 'background-color 0.3s ease-out';
                    closeButton.style.transition = 'opacity 0.2s ease-out';
                    
                    container.style.transform = '';
                    image.style.transform = '';
                    lightbox.style.backgroundColor = '';
                    closeButton.style.opacity = '1';
                }
            }
            
            // Add lightbox click handlers
            lightbox.addEventListener('click', (e) => {
                if (e.target === lightbox || e.target.classList.contains('case-study-lightbox-container')) {
                    e.stopPropagation();
                    if (!isDragging) { // Only close if not dragging
                        animateAndCloseLightbox(lightbox);
                    }
                }
            });
            
            lightbox.querySelector('.case-study-lightbox-close').addEventListener('click', (e) => {
                e.stopPropagation();
                animateAndCloseLightbox(lightbox);
            });
            
            // Add touch handlers for swipe to dismiss
            lightbox.addEventListener('touchstart', handleLightboxDragStart, { passive: false });
            lightbox.addEventListener('touchmove', handleLightboxDragMove, { passive: false });
            lightbox.addEventListener('touchend', handleLightboxDragEnd, { passive: false });
            
            // Add mouse handlers for testing
            lightbox.addEventListener('mousedown', handleLightboxDragStart);
            lightbox.addEventListener('mousemove', handleLightboxDragMove);
            lightbox.addEventListener('mouseup', handleLightboxDragEnd);

            // Add escape key handler for lightbox
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape' && lightbox.classList.contains('active')) {
                    e.stopPropagation(); // Prevent event from reaching modal
                    animateAndCloseLightbox(lightbox);
                }
            });

            function animateAndCloseLightbox(lightbox) {
                const container = lightbox.querySelector('.case-study-lightbox-container');
                const image = lightbox.querySelector('.case-study-lightbox-image');
                const closeButton = lightbox.querySelector('.case-study-lightbox-close');
                
                // Add closing class to trigger animation
                lightbox.classList.add('closing');
                
                // Animate the image scale down and fade
                image.style.transition = 'transform 0.3s ease-out, opacity 0.3s ease-out';
                image.style.transform = 'scale(0.9)';
                image.style.opacity = '0';
                
                // Fade out the container and background
                container.style.transition = 'opacity 0.3s ease-out';
                container.style.opacity = '0';
                lightbox.style.transition = 'background-color 0.3s ease-out';
                lightbox.style.backgroundColor = 'rgba(0, 0, 0, 0)';
                
                // Hide close button
                if (closeButton) {
                    closeButton.style.transition = 'opacity 0.2s ease-out';
                    closeButton.style.opacity = '0';
                }
                
                // Remove classes and reset styles after animation
                setTimeout(() => {
                    lightbox.classList.remove('active', 'closing');
                    // Reset all transforms and styles
                    container.style.transform = '';
                    container.style.opacity = '';
                    image.style.transform = '';
                    image.style.opacity = '';
                    lightbox.style.backgroundColor = '';
                    if (closeButton) {
                        closeButton.style.opacity = '';
                    }
                }, 300);
            }
        }
        
        // Update content with header immediately
        portfolioContent.innerHTML = `
            <div class="flex items-center mb-6">
                <img src="${project.logo}" alt="${project.company} Logo" class="w-12 h-12 rounded-full mr-4">
                <div>
                    <h2 class="text-xl font-bold text-gray-800 dark:text-gray-200">${project.title}</h2>
                    <p class="text-gray-600 dark:text-gray-400">${project.company}, ${project.location}</p>
                </div>
            </div>
        `;
        
        // Force a reflow to ensure the initial state is rendered
        content.offsetHeight;
        
        // Start animation immediately in the next frame
        requestAnimationFrame(() => {
            content.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
            background.style.transition = 'opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
            content.style.transform = isMobile ? 'translateY(0)' : 'translate(-50%, 0)';
            background.style.opacity = '1';
            
            // Show mobile close button with a slight delay
            if (isMobile) {
                setTimeout(() => {
                    mobileCloseButton.classList.add('active');
                }, 150);
            }
        });

        // Log the dimensions
        setTimeout(() => {
            const rect = content.getBoundingClientRect();
            console.log('Modal width:', rect.width, 'pixels');
            console.log('Modal height:', rect.height, 'pixels');
        }, 300); // Wait for any initial animations
    }

    function updateModalContent(project, projectDetail) {
        const portfolioContent = document.getElementById('portfolioContent');
        const caseStudyContent = portfolioContent.querySelector('.case-study-content') || document.createElement('div');
        caseStudyContent.className = 'case-study-content';
        
        // Update only the case study content
        caseStudyContent.innerHTML = `
            <article class="prose prose-slate dark:prose-invert prose-headings:font-bold prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl prose-h4:text-xl max-w-none">
                ${projectDetail.sections.map(section => `
                    ${section.title ? `<h${section.headerLevel}>${section.title}</h${section.headerLevel}>` : ''}
                    ${section.content}
                `).join('')}
            </article>
        `;

        // If the case study content isn't already in the DOM, append it
        if (!portfolioContent.querySelector('.case-study-content')) {
            portfolioContent.appendChild(caseStudyContent);
        }

        // Setup video optimization after content is added
        setupVideoIntersectionObserver();
    }

    function closePortfolioModal(skipHistory = false) {
        const portfolioModal = document.getElementById('portfolioDetailModal');
        const portfolioContent = document.getElementById('portfolioContent');
        const content = portfolioModal.querySelector('#portfolioModalContent');
        const background = portfolioModal.querySelector('#portfolioModalBackground');
        const mobileCloseButton = portfolioModal.querySelector('#closePortfolioModalButtonMobile');
        const isMobile = window.innerWidth < 640;
        
        // Store scroll position before closing
        lastScrollPosition = portfolioContent.scrollTop;
        
        // Get the scroll position before removing modal-open class
        const scrollY = document.documentElement.style.getPropertyValue('--scroll-position');
        
        // Restore scrolling
        document.body.classList.remove('modal-open');
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
        
        // Update URL back to root if not handling history externally
        if (!skipHistory) {
            history.pushState({}, '', '/');
        }

        // Different closing animation for maximized state
        if (isMaximized) {
            content.style.transition = `
                transform 0.3s cubic-bezier(0.4, 0, 0.2, 1),
                opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1)
            `;
            background.style.transition = 'opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
            
            // Fade out and slightly scale down
            content.style.transform = 'scale(0.95)';
            content.style.opacity = '0';
            background.style.opacity = '0';
            
            isMaximized = false;
        } else {
            // Original closing animation for non-maximized state
            content.style.transition = 'transform 0.3s ease-out';
            background.style.transition = 'opacity 0.3s ease-out';
            
            if (isMobile) {
                content.style.transform = 'translateY(100%)';
            } else {
                content.style.transform = 'translate(-50%, 100%)';
            }
            background.style.opacity = '0';
        }
        
        // Hide mobile close button first
        if (isMobile) {
            mobileCloseButton.classList.remove('active');
        }
        
        // Reset status bar and theme color
        const isDark = document.documentElement.classList.contains('dark');
        const metaStatusBar = document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]');
        const metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (metaStatusBar) {
            metaStatusBar.setAttribute('content', isDark ? 'black-translucent' : 'default');
        }
        if (metaThemeColor) {
            metaThemeColor.setAttribute('content', isDark ? '#000000' : '#FFFFFF');
        }
        
        // Restore body scrolling
        document.body.style.overflow = '';
        
        setTimeout(() => {
            portfolioModal.classList.add('hidden');
            resetDragState();
            
            // Reset all styles after hiding
            content.style.transform = '';
            content.style.opacity = '';
            content.style.width = '';
            content.style.height = '';
            content.style.maxWidth = '';
            content.style.maxHeight = '';
            content.style.top = '';
            content.style.left = '';
            content.style.borderRadius = '';
            
            portfolioContent.style.maxWidth = '';
            portfolioContent.style.margin = '';
            portfolioContent.style.padding = '';
            portfolioContent.style.height = '';
            portfolioContent.style.position = '';
        }, 300);
    }

    function handleDragStart(clientY, event) {
        const portfolioModal = document.getElementById('portfolioDetailModal');
        const portfolioModalContent = document.getElementById('portfolioModalContent');
        const portfolioContent = document.getElementById('portfolioContent');
        const isMobile = window.innerWidth < 640;
        
        if (portfolioModal.classList.contains('hidden') || !isMobile) return false;
        
        // Check if we're interacting with the puller
        const isTouchingPuller = event?.target.closest('.portfolio-modal-puller');
        
        // If touching the puller, always allow dragging regardless of scroll position
        if (isTouchingPuller) {
            startY = clientY;
            lastDragY = clientY;
            lastDragTime = Date.now();
            isDragging = true;
            startTranslateY = currentTranslateY;
            dragVelocity = 0;
            
            // Store initial scroll position
            initialScrollTop = portfolioContent.scrollTop;
            
            // Disable content scrolling while dragging
            portfolioContent.style.overflow = 'hidden';
            portfolioModalContent.style.transition = 'none';
            return true;
        }
        
        // For content area, only allow drag when at top
        const isAtTop = portfolioContent.scrollTop <= 0;
        if (isAtTop && event?.type === 'touchmove') {
            startY = clientY;
            lastDragY = clientY;
            lastDragTime = Date.now();
            isDragging = true;
            startTranslateY = currentTranslateY;
            dragVelocity = 0;
            
            // Disable content scrolling while dragging
            portfolioContent.style.overflow = 'hidden';
            portfolioModalContent.style.transition = 'none';
            return true;
        }
        
        return false;
    }

    function handleDragMove(clientY) {
        if (!isDragging) return;
        
        const portfolioModalContent = document.getElementById('portfolioModalContent');
        const deltaY = clientY - startY;
        
        const lastDragDirection = clientY > lastDragY ? 'down' : 'up';
        window.lastDragDirection = lastDragDirection;
        
        const newTranslateY = Math.max(0, startTranslateY + deltaY);
        peakTranslateY = Math.max(peakTranslateY, newTranslateY);
        
        const currentTime = Date.now();
        const deltaTime = currentTime - lastDragTime;
        dragVelocity = deltaTime > 0 ? (clientY - lastDragY) / deltaTime : 0;
        
        lastDragTime = currentTime;
        lastDragY = clientY;
        currentTranslateY = newTranslateY;

        portfolioModalContent.style.transform = `translateY(${currentTranslateY}px)`;
        
        const progress = Math.min(currentTranslateY / DISMISS_THRESHOLD, 1);
        const opacity = 1 - progress;
        document.getElementById('portfolioModalBackground').style.opacity = opacity;
    }

    function handleDragEnd() {
        if (!isDragging) return;
        
        isDragging = false;
        const finalTranslateY = currentTranslateY;
        const lastDirection = window.lastDragDirection;
        
        const shouldDismiss = lastDirection === 'down' && finalTranslateY > 50;
        
        // Re-enable content scrolling
        const portfolioContent = document.getElementById('portfolioContent');
        portfolioContent.style.overflow = 'auto';
        
        if (shouldDismiss) {
            closePortfolioModal();
        } else {
            snapBack();
        }
        
        window.lastDragDirection = undefined;
        window.dragDirectionHistory = [];
    }

    function snapBack() {
        const portfolioModalContent = document.getElementById('portfolioModalContent');
        const background = document.getElementById('portfolioModalBackground');
        
        resetDragState();
        
        portfolioModalContent.style.transition = 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
        background.style.transition = 'opacity 0.4s ease-out';
        
        portfolioModalContent.offsetHeight;
        
        portfolioModalContent.style.transform = 'translateY(0)';
        background.style.opacity = '1';
        
        setTimeout(() => {
            portfolioModalContent.style.transition = '';
            background.style.transition = '';
        }, 400);
    }

    // Touch event handlers
    document.addEventListener('touchstart', (e) => {
        const portfolioModal = document.getElementById('portfolioDetailModal');
        const portfolioContent = document.getElementById('portfolioContent');
        if (portfolioModal.classList.contains('hidden')) return;
        
        window.dragDirectionHistory = [];
        lastDragY = e.touches[0].clientY;
        
        // Store initial scroll position
        initialScrollTop = portfolioContent.scrollTop;
        
        // If touching the puller, prevent default to ensure drag works
        if (e.target.closest('.portfolio-modal-puller')) {
            if (handleDragStart(e.touches[0].clientY, e) && e.cancelable) {
                e.preventDefault();
            }
        }
    }, { passive: false });

    document.addEventListener('touchmove', (e) => {
        const portfolioModal = document.getElementById('portfolioDetailModal');
        const portfolioContent = document.getElementById('portfolioContent');
        const isMobile = window.innerWidth < 640;
        
        if (portfolioModal.classList.contains('hidden') || !isMobile) return;
        
        const touch = e.touches[0];
        const touchDeltaY = touch.clientY - lastDragY;
        const isAtTop = portfolioContent.scrollTop <= 0;
        
        // If we're already dragging, handle the drag
        if (isDragging) {
            if (e.cancelable) {
                e.preventDefault();
            }
            handleDragMove(touch.clientY);
            return;
        }
        
        // Only allow starting drag if we're at the top and moving down
        if (isAtTop && touchDeltaY > 0) {
            // Add a threshold to prevent accidental drags
            if (touchDeltaY > 5 && e.cancelable) {
                e.preventDefault();
                handleDragStart(touch.clientY, e);
            }
        }
        
        // Update last touch position
        lastDragY = touch.clientY;
    }, { passive: false });

    // Handle scroll momentum
    let isScrolling;
    document.addEventListener('scroll', (e) => {
        const portfolioModal = document.getElementById('portfolioDetailModal');
        const portfolioContent = document.getElementById('portfolioContent');
        
        if (!portfolioModal || portfolioModal.classList.contains('hidden')) return;
        
        // Clear the existing timeout
        window.clearTimeout(isScrolling);
        
        // Set a timeout to run after scrolling ends
        isScrolling = setTimeout(() => {
            // Check if we're at the top after scrolling stops
            if (portfolioContent.scrollTop <= 0) {
                portfolioContent.style.overflow = 'auto';
            }
        }, 66);
    }, { passive: true });

    document.addEventListener('touchend', () => {
        handleDragEnd();
    }, { passive: false });

    // Mouse event handlers (for desktop testing)
    document.addEventListener('mousedown', (e) => {
        const portfolioModal = document.getElementById('portfolioDetailModal');
        if (portfolioModal.classList.contains('hidden')) return;
        
        if (handleDragStart(e.clientY, e)) {
            e.preventDefault();
        }
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            e.preventDefault();
            handleDragMove(e.clientY);
        }
    });

    document.addEventListener('mouseup', () => {
        if (isDragging) {
            handleDragEnd();
        }
    });

    // Update the keydown event handler to support backspace
    document.addEventListener('keydown', function(e) {
        const portfolioModal = document.getElementById('portfolioDetailModal');
        const lightbox = document.querySelector('.case-study-lightbox');
        
        // Handle Escape key
        if (e.key === 'Escape' && portfolioModal && !portfolioModal.classList.contains('hidden')) {
            // Only close modal if lightbox is not active
            if (!lightbox || !lightbox.classList.contains('active')) {
                closePortfolioModal();
            }
        }
        
        // Handle Backspace key
        if (e.key === 'Backspace' && !portfolioModal.classList.contains('hidden')) {
            // Don't trigger if user is typing in an input/textarea
            if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
                e.preventDefault(); // Prevent browser back
                closePortfolioModal();
            }
        } else if (e.key === 'Backspace' && portfolioModal.classList.contains('hidden') && lastOpenedProjectId) {
            // Don't trigger if user is typing in an input/textarea
            if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
                e.preventDefault(); // Prevent browser back
                loadCaseStudy(lastOpenedProjectId);
                
                // Restore scroll position after content is loaded
                const portfolioContent = document.getElementById('portfolioContent');
                if (portfolioContent) {
                    setTimeout(() => {
                        portfolioContent.scrollTop = lastScrollPosition;
                    }, 100); // Small delay to ensure content is rendered
                }
            }
        }
    });

    async function loadCaseStudy(projectId) {
        try {
            // Store the project ID before loading
            lastOpenedProjectId = projectId;
            
            // Use cached data if available
            if (!cachedPortfolioData) {
                cachedPortfolioData = await fetch('/data/portfolio.json').then(res => res.json());
            }
            const project = cachedPortfolioData.projects.find(p => p.id === parseInt(projectId));
            
            if (project) {
                // Open modal synchronously with basic info
                openPortfolioModal(project);
                
                // Then load case study content asynchronously
                if (project.caseStudyFile) {
                    loadCaseStudyContent(project);
                }
            }
        } catch (error) {
            // Silently fail - error UI is handled in nested try-catch
        }
    }

    async function loadCaseStudyContent(project) {
                    const portfolioContent = document.getElementById('portfolioContent');
                    const caseStudyContent = document.createElement('div');
                    caseStudyContent.className = 'case-study-content';
                    
                    // Add loading state after the header
                    caseStudyContent.innerHTML = `
                        <div class="animate-pulse space-y-4 mt-8">
                            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                        </div>
                    `;
                    portfolioContent.appendChild(caseStudyContent);

                    try {
                        const markdownResponse = await fetch(`/case-studies/${project.caseStudyFile}`);
                        
                        if (!markdownResponse.ok) {
                            throw new Error(`Case study not found. Status: ${markdownResponse.status}`);
                        }
                        
                        const markdown = await markdownResponse.text();
                        const sections = parseMarkdown(markdown);
                        
                        // Update content with case study
                        updateModalContent(project, { sections });
                    } catch (error) {
                        caseStudyContent.innerHTML = `
                            <div class="text-red-500 dark:text-red-400 mt-8">
                                Failed to load case study content. Please try again later.
                            </div>
                        `;
        }
    }

    // Function to check URL and open case study if needed
    function checkUrlForCaseStudy() {
        // Get the path without leading/trailing slashes
        const path = window.location.pathname.replace(/^\/|\/$/g, '');
        
        if (path) {
            // Load portfolio data to find the matching case study
            fetch('/data/portfolio.json')
                .then(res => res.json())
                .then(portfolioData => {
                    // Find project by matching the URL path to the case study file name
                    const project = portfolioData.projects.find(p => 
                        p.caseStudyFile && p.caseStudyFile.replace('.md', '') === path
                    );
                    
                    if (project) {
                        loadCaseStudy(project.id);
                    }
                })
                .catch(error => {
                    // Silently fail - error UI is handled in nested try-catch
                });
        }
    }

    // Check URL immediately
    checkUrlForCaseStudy();

    // Also check when DOM is fully loaded (in case portfolio data wasn't ready)
    document.addEventListener('DOMContentLoaded', checkUrlForCaseStudy);

    // Handle browser back/forward
    window.addEventListener('popstate', (event) => {
        const path = window.location.pathname.replace(/^\/|\/$/g, '');
        
        if (path) {
            checkUrlForCaseStudy();
        } else {
            // No case study in URL, close the modal
            const portfolioModal = document.getElementById('portfolioDetailModal');
            if (!portfolioModal.classList.contains('hidden')) {
                closePortfolioModal(true); // true = don't update history
            }
        }
    });

    // Add touch event handlers for mobile close button
    document.addEventListener('DOMContentLoaded', () => {
        const mobileCloseButton = document.getElementById('closePortfolioModalButtonMobile');
        if (mobileCloseButton) {
            mobileCloseButton.addEventListener('touchstart', (e) => {
                e.preventDefault(); // Prevent any default touch behavior
                e.stopPropagation(); // Stop the event from bubbling up
            }, { passive: false });

            mobileCloseButton.addEventListener('touchmove', (e) => {
                e.preventDefault(); // Prevent scrolling when touching the button
                e.stopPropagation(); // Stop the event from reaching the background
            }, { passive: false });

            mobileCloseButton.addEventListener('touchend', (e) => {
                e.preventDefault();
                e.stopPropagation();
                closePortfolioModal(); // Close the modal on touch end
            }, { passive: false });
        }
    });

    // Add this function after the other initialization code
    function initMaximizeButton() {
        const maximizeButton = document.getElementById('maximizePortfolioModalButton');
        const modalContent = document.getElementById('portfolioModalContent');
        const portfolioContent = document.getElementById('portfolioContent');
        
        maximizeButton.addEventListener('click', () => {
            isMaximized = !isMaximized;
            
            // Store current scroll position
            const currentScrollTop = portfolioContent.scrollTop;
            
            // Add smooth transition for all properties
            modalContent.style.transition = `
                width 0.3s cubic-bezier(0.2, 0, 0, 1),
                height 0.3s cubic-bezier(0.2, 0, 0, 1),
                max-width 0.3s cubic-bezier(0.2, 0, 0, 1),
                max-height 0.3s cubic-bezier(0.2, 0, 0, 1),
                top 0.3s cubic-bezier(0.2, 0, 0, 1),
                left 0.3s cubic-bezier(0.2, 0, 0, 1),
                transform 0.3s cubic-bezier(0.2, 0, 0, 1),
                border-radius 0.3s cubic-bezier(0.2, 0, 0, 1)
            `;
            
            portfolioContent.style.transition = 'max-width 0.3s cubic-bezier(0.2, 0, 0, 1)';
            
            if (isMaximized) {
                // Store current position and size before maximizing
                const rect = modalContent.getBoundingClientRect();
                modalContent.style.transformOrigin = 'top left';
                
                // First set initial position to match current view
                modalContent.style.top = `${rect.top}px`;
                modalContent.style.left = `${rect.left}px`;
                modalContent.style.width = `${rect.width}px`;
                modalContent.style.height = `${rect.height}px`;
                
                // Force a reflow
                modalContent.offsetHeight;
                
                // Temporarily disable scroll to prevent content jump
                portfolioContent.style.overflow = 'hidden';
                
                // Then animate to maximized state
                modalContent.style.width = '100%';
                modalContent.style.height = '100vh';
                modalContent.style.maxWidth = '100%';
                modalContent.style.maxHeight = '100vh';
                modalContent.style.top = '0';
                modalContent.style.left = '0';
                modalContent.style.transform = 'none';
                modalContent.style.borderRadius = '0';
                
                // Adjust content width for maximized state
                portfolioContent.style.maxWidth = '940px';
                portfolioContent.style.margin = '0 auto';
                portfolioContent.style.padding = '2rem 2rem 6rem 2rem';
                portfolioContent.style.height = '100%';
                portfolioContent.style.position = 'relative';
                
                // Re-enable scroll and restore position after transform
                setTimeout(() => {
                    portfolioContent.style.overflow = 'auto';
                    portfolioContent.scrollTop = currentScrollTop;
                }, 50);
                
                // Update maximize icon to minimize
                maximizeButton.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3v3a2 2 0 0 1-2 2H3"/><path d="M21 8h-3a2 2 0 0 1-2-2V3"/><path d="M3 16h3a2 2 0 0 1 2 2v3"/><path d="M16 21v-3a2 2 0 0 1 2-2h3"/></svg>
                `;
            } else {
                // Temporarily disable scroll
                portfolioContent.style.overflow = 'hidden';
                
                // Restore original size with animation
                modalContent.style.width = '';
                modalContent.style.height = '';
                modalContent.style.maxWidth = '';
                modalContent.style.maxHeight = '';
                modalContent.style.top = '';
                modalContent.style.left = '';
                modalContent.style.transform = 'translate(-50%, 0)';
                modalContent.style.borderRadius = '';
                
                // Reset content width
                portfolioContent.style.maxWidth = '';
                portfolioContent.style.margin = '';
                portfolioContent.style.padding = '';
                portfolioContent.style.height = '';
                portfolioContent.style.position = '';
                
                // Re-enable scroll and restore position after transform
                setTimeout(() => {
                    portfolioContent.style.overflow = 'auto';
                    portfolioContent.scrollTop = currentScrollTop;
                }, 50);
                
                // Restore maximize icon
                maximizeButton.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3"/><path d="M21 8V5a2 2 0 0 0-2-2h-3"/><path d="M3 16v3a2 2 0 0 0 2 2h3"/><path d="M16 21h3a2 2 0 0 0 2-2v-3"/></svg>
                `;
            }
            
            // Clear transitions after animation completes
            setTimeout(() => {
                modalContent.style.transition = '';
                modalContent.style.transformOrigin = '';
                portfolioContent.style.transition = '';
            }, 300);
        });
    }

    // Call initMaximizeButton at the end of initPortfolioModal
    initMaximizeButton();
} 