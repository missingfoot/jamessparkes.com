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
    function formatText(text) {
        return text
            // Convert bold text
            .replace(/\*\*(.*?)\*\*/g, '<span class="font-semibold">$1</span>')
            // Convert links with consistent styling
            .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="group inline-block text-gray-700 dark:text-white underline hover:text-gray-900 dark:hover:text-gray-200 transition-colors duration-300"><span class="inline-block transform group-hover:-translate-y-0.5 transition-transform duration-150">$1</span></a>');
    }

    // Function to parse markdown sections
    function parseMarkdown(markdown) {
        const sections = [];
        let currentSection = null;
        let inList = false;
        
        // Split markdown into lines and clean them
        const lines = markdown.split('\n').map(line => line.trimEnd());
        
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const nextLine = lines[i + 1] || '';

            // Check for section headers (##, ###, or ####)
            if (line.match(/^#{2,4}\s/)) {
                if (currentSection) {
                    sections.push(currentSection);
                }
                const headerLevel = line.match(/^(#{2,4})\s/)[1].length;
                const title = line.replace(/^#{2,4}\s/, '').trim();
                currentSection = {
                    title: formatText(title),
                    headerLevel,
                    content: ''
                };
                inList = false;
            } else if (currentSection && line.trim()) {
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
                        currentSection.content += `<p class="mb-6">${formattedLine}</p>`;
                    } else if (nextLine.trim()) {
                        // Next line has content, add a line break
                        currentSection.content += `${formattedLine}<br>`;
                    } else {
                        // Continue in same paragraph
                        currentSection.content += formattedLine + ' ';
                    }
                }
            } else if (currentSection && !line.trim() && inList) {
                currentSection.content += '</ul>';
                inList = false;
            }
        }
        
        if (currentSection && inList) {
            currentSection.content += '</ul>';
        }
        
        if (currentSection) {
            sections.push(currentSection);
        }
        
        return sections;
    }

    // Add click event listener using event delegation
    document.addEventListener('click', async (e) => {
        const portfolioDetailLink = e.target.closest('[data-portfolio-detail]');
        const closeModalButton = e.target.closest('#closePortfolioModalButton');
        const portfolioModalBackground = e.target.closest('#portfolioModalBackground');
        const portfolioModal = document.getElementById('portfolioDetailModal');

        if (portfolioDetailLink) {
            e.preventDefault();
            const projectId = portfolioDetailLink.dataset.portfolioDetail;
            try {
                // Load portfolio data and markdown file
                const portfolioResponse = await fetch('/data/portfolio.json');
                const portfolioData = await portfolioResponse.json();
                const project = portfolioData.projects.find(p => p.id === parseInt(projectId));
                
                if (project) {
                    const markdownFilename = getMarkdownFilename(project);
                    const markdownResponse = await fetch(`/case-studies/${markdownFilename}.md`);
                    if (!markdownResponse.ok) throw new Error('Case study not found');
                    
                    const markdown = await markdownResponse.text();
                    const sections = parseMarkdown(markdown);
                    openPortfolioModal(project, { sections });
                }
            } catch (error) {
                console.error('Error loading project details:', error);
            }
        }

        if (closeModalButton || portfolioModalBackground) {
            e.preventDefault(); // Prevent default link behavior
            closePortfolioModal();
        }
    });

    function openPortfolioModal(project, projectDetail) {
        resetDragState();
        const portfolioModal = document.getElementById('portfolioDetailModal');
        const portfolioContent = document.getElementById('portfolioContent');
        const isMobile = window.innerWidth < 640;
        
        // Update content
        portfolioContent.innerHTML = `<div class="flex items-center mb-6">
                <img src="${project.logo}" alt="${project.company} Logo" class="w-12 h-12 rounded-full mr-4">
                <div>
                    <h2 class="text-xl font-bold text-gray-800 dark:text-gray-200">${project.title}</h2>
                    <p class="text-gray-600 dark:text-gray-400">${project.company}, ${project.location}</p>
                </div>
            </div>
            <div class="prose dark:prose-invert max-w-none">${projectDetail.sections.map(section => 
                `<h${section.headerLevel} class="text-${section.headerLevel === 2 ? 'xl' : section.headerLevel === 3 ? 'lg' : 'base'} font-bold text-gray-800 dark:text-gray-200 mt-6 mb-3">${section.title}</h${section.headerLevel}><div class="text-gray-800 dark:text-gray-200">${section.content}</div>`
            ).join('')}</div>`;
        
        // Update status bar
        const metaStatusBar = document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]');
        if (metaStatusBar) {
            metaStatusBar.setAttribute('content', 'black-translucent');
        }
        
        portfolioModal.classList.remove('hidden');
        prepareModalForOpen();
        
        requestAnimationFrame(() => {
            const content = portfolioModal.querySelector('#portfolioModalContent');
            const background = portfolioModal.querySelector('#portfolioModalBackground');
            
            content.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
            background.style.transition = 'opacity 0.3s ease-out';
            
            content.style.transform = 'translate(0, 0)';
            background.style.opacity = '1';
        });
    }

    function closePortfolioModal() {
        const portfolioModal = document.getElementById('portfolioDetailModal');
        const background = portfolioModal.querySelector('#portfolioModalBackground');
        const content = portfolioModal.querySelector('#portfolioModalContent');
        const isMobile = window.innerWidth < 640;
        
        content.style.transition = 'transform 0.3s ease-out';
        background.style.transition = 'opacity 0.3s ease-out';
        
        if (isMobile) {
            content.style.transform = 'translateY(100%)';
        } else {
            content.style.transform = 'translateX(100%)';
        }
        background.style.opacity = '0';
        
        // Reset status bar
        const isDark = document.documentElement.classList.contains('dark');
        const metaStatusBar = document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]');
        if (metaStatusBar) {
            metaStatusBar.setAttribute('content', isDark ? 'black-translucent' : 'default');
        }
        
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
} 