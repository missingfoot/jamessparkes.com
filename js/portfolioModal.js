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

    // Helper function to format text with bold and links
    function formatText(text, isHeader = false) {
        let formatted = text;
        
        // Only process bold text if not a header
        if (!isHeader) {
            formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<span class="font-semibold">$1</span>');
        }
        
        // Process images - look in case-studies/img directory
        formatted = formatted.replace(/!\[(.*?)\]\((.*?)\)/g, 
            '<figure class="my-8">' +
                '<img src="/case-studies/img/$2" alt="$1" class="rounded-lg w-full">' +
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
                        // End of paragraph
                        currentSection.content += `<p>${formattedLine}</p>`;
                    } else if (nextLine.trim()) {
                        // Next line has content, add a line break
                        currentSection.content += `${formattedLine}<br>`;
                    } else {
                        // Continue in same paragraph
                        currentSection.content += formattedLine + ' ';
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

    // Add scroll event handling for desktop
    document.addEventListener('wheel', (e) => {
        const portfolioModal = document.getElementById('portfolioDetailModal');
        if (portfolioModal.classList.contains('hidden') || window.innerWidth < 640) return;

        const target = e.target;
        const portfolioContent = document.getElementById('portfolioContent');

        // If we're hovering over the modal content and it's scrollable
        if (portfolioContent.contains(target)) {
            const scrollTop = portfolioContent.scrollTop;
            const scrollHeight = portfolioContent.scrollHeight;
            const clientHeight = portfolioContent.clientHeight;

            // Allow scrolling only if there's room to scroll in that direction
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
        const closeModalButton = e.target.closest('#closePortfolioModalButton');
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
        const isMobile = window.innerWidth < 640;
        
        // Update URL with clean path
        const casePath = project.caseStudyFile.replace('.md', '');
        const url = new URL(window.location.origin + '/' + casePath);
        history.pushState({}, '', url);
        
        // Remove hidden class but keep modal visually hidden
        portfolioModal.classList.remove('hidden');
        
        // Set initial state
        content.style.transition = 'none';
        background.style.transition = 'none';
        // For both mobile and desktop, start from bottom center
        content.style.transform = isMobile ? 'translateY(100%)' : 'translate(-50%, 100%)';
        background.style.opacity = '0';
        
        // Update content with header only
        portfolioContent.innerHTML = `
            <div class="flex items-center mb-6">
                <img src="${project.logo}" alt="${project.company} Logo" class="w-12 h-12 rounded-full mr-4">
                <div>
                    <h2 class="text-xl font-bold text-gray-800 dark:text-gray-200">${project.title}</h2>
                    <p class="text-gray-600 dark:text-gray-400">${project.company}, ${project.location}</p>
                </div>
            </div>
        `;
        
        // Force a reflow
        content.offsetHeight;
        
        // Start animation
        requestAnimationFrame(() => {
            content.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
            background.style.transition = 'opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
            content.style.transform = isMobile ? 'translateY(0)' : 'translate(-50%, 0)';
            background.style.opacity = '1';
        });
        
        document.body.style.overflow = 'hidden';
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
    }

    function closePortfolioModal(skipHistory = false) {
        const portfolioModal = document.getElementById('portfolioDetailModal');
        const background = portfolioModal.querySelector('#portfolioModalBackground');
        const content = portfolioModal.querySelector('#portfolioModalContent');
        const isMobile = window.innerWidth < 640;
        
        // Update URL back to root
        if (!skipHistory) {
            history.pushState({}, '', '/');
        }
        
        content.style.transition = 'transform 0.3s ease-out';
        background.style.transition = 'opacity 0.3s ease-out';
        
        content.style.transform = isMobile ? 'translateY(100%)' : 'translate(-50%, 100%)';
        background.style.opacity = '0';
        
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
        }, 300);
    }

    function handleDragStart(clientY, event) {
        const portfolioModal = document.getElementById('portfolioDetailModal');
        const portfolioModalContent = document.getElementById('portfolioModalContent');
        const portfolioContent = document.getElementById('portfolioContent');
        const isMobile = window.innerWidth < 640;
        
        if (portfolioModal.classList.contains('hidden') || !isMobile) return false;
        
        initialScrollTop = portfolioContent.scrollTop;
        
        const isTouchingPuller = event?.target.closest('.puller') || event?.target.classList.contains('puller');
        const isAtTop = portfolioContent.scrollTop <= 0;
        
        if (isTouchingPuller || (isAtTop && event?.type === 'touchmove')) {
            startY = clientY;
            lastDragY = clientY;
            lastDragTime = Date.now();
            isDragging = true;
            startTranslateY = currentTranslateY;
            dragVelocity = 0;

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
        
        const newTranslateY = Math.max(0, startTranslateY + (deltaY / DRAG_RESISTANCE));
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
        if (portfolioModal.classList.contains('hidden')) return;
        
        window.dragDirectionHistory = [];
        lastDragY = e.touches[0].clientY;
        
        if (e.target.closest('.puller')) {
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
        
        if (isDragging) {
            if (e.cancelable) {
                e.preventDefault();
            }
            handleDragMove(touch.clientY);
            return;
        }
        
        if (isAtTop && touchDeltaY > 0) {
            if (touchDeltaY > 5 && e.cancelable) {
                e.preventDefault();
                handleDragStart(touch.clientY, e);
            }
        }
        
        lastDragY = touch.clientY;
    }, { passive: false });

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

    // Close modal on escape key press
    document.addEventListener('keydown', function(e) {
        const portfolioModal = document.getElementById('portfolioDetailModal');
        if (e.key === 'Escape' && portfolioModal && !portfolioModal.classList.contains('hidden')) {
            closePortfolioModal();
        }
    });

    async function loadCaseStudy(projectId) {
        try {
            const portfolioData = await fetch('/data/portfolio.json').then(res => res.json());
            const project = portfolioData.projects.find(p => p.id === parseInt(projectId));
            
            if (project) {
                // Open modal immediately with project info
                openPortfolioModal(project);
                
                // Then load case study content asynchronously
                if (project.caseStudyFile) {
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
            }
        } catch (error) {
            // Silently fail - error UI is handled in nested try-catch
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
} 