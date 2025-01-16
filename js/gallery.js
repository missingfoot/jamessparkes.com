export function initGallery() {
    document.querySelectorAll('[data-gallery]').forEach(gallery => {
        const id = gallery.dataset.gallery;
        const container = gallery.querySelector('[data-gallery-container]');
        const imagesWrapper = gallery.querySelector('[data-gallery-images]');
        const images = imagesWrapper.querySelectorAll('img');
        const prevBtn = gallery.querySelector('[data-prev]');
        const nextBtn = gallery.querySelector('[data-next]');
        const pagination = gallery.querySelector('[data-pagination]');
        let currentIndex = 0;
        let startX = 0;
        let startY = 0;
        let lastX = 0;
        let lastDirection = null;
        let currentTranslate = 0;
        let isDragging = false;
        let isSwiping = false;
        let isAnimating = false;
        
        // Ensure all images are loaded before initializing
        Promise.all(Array.from(images).map(img => {
            if (img.complete) return Promise.resolve();
            return new Promise(resolve => {
                img.onload = resolve;
                img.onerror = resolve;
            });
        })).then(() => {
            updatePagination();
        });

        // Add event listeners for buttons
        prevBtn?.addEventListener('click', () => {
            if (isAnimating) return;
            isAnimating = true;
            currentIndex = (currentIndex - 1 + images.length) % images.length;
            snapToIndex(currentIndex);
        });

        nextBtn?.addEventListener('click', () => {
            if (isAnimating) return;
            isAnimating = true;
            currentIndex = (currentIndex + 1) % images.length;
            snapToIndex(currentIndex);
        });

        // Add keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (isAnimating) return;
            if (e.key === 'ArrowLeft') {
                prevBtn?.click();
            } else if (e.key === 'ArrowRight') {
                nextBtn?.click();
            }
        });

        // Add touch and mouse support
        if (container) {
            // Touch events
            container.addEventListener('touchstart', handleStart, { passive: false });
            container.addEventListener('touchmove', handleMove, { passive: false });
            container.addEventListener('touchend', handleEnd);
            
            // Mouse events
            container.addEventListener('mousedown', handleStart);
            container.addEventListener('mousemove', handleMove);
            container.addEventListener('mouseup', handleEnd);
            container.addEventListener('mouseleave', handleEnd);
            
            // Prevent image dragging
            container.addEventListener('dragstart', (e) => e.preventDefault());
        }

        function handleStart(e) {
            if (isAnimating) return;
            
            // Get coordinates whether mouse or touch
            const point = e.touches ? e.touches[0] : e;
            startX = point.clientX;
            startY = point.clientY;
            lastX = startX;
            lastDirection = null;
            currentTranslate = -currentIndex * 100;
            isDragging = true;
            isSwiping = false;
            
            // Remove transition during drag
            imagesWrapper.style.transition = 'none';
        }

        function handleMove(e) {
            if (!isDragging || isAnimating) return;

            // Get coordinates whether mouse or touch
            const point = e.touches ? e.touches[0] : e;
            const currentX = point.clientX;
            const currentY = point.clientY;
            const deltaX = startX - currentX;
            const deltaY = startY - currentY;
            
            // Update direction based on current movement
            const currentDeltaX = currentX - lastX;
            if (Math.abs(currentDeltaX) > 1) {
                lastDirection = currentDeltaX < 0 ? 'left' : 'right';
            }
            lastX = currentX;

            if (!isSwiping) {
                if (Math.abs(deltaX) > Math.abs(deltaY)) {
                    isSwiping = true;
                    e.preventDefault();
                }
            } else {
                e.preventDefault();
                // Calculate the new position as percentage
                const percentageMoved = (deltaX / container.offsetWidth) * 100;
                const newTranslate = currentTranslate - percentageMoved;
                
                // Add resistance at the edges
                const minTranslate = -(images.length - 1) * 100;
                const maxTranslate = 0;
                let finalTranslate = newTranslate;
                
                if (newTranslate > maxTranslate) {
                    finalTranslate = maxTranslate + (newTranslate - maxTranslate) * 0.2;
                } else if (newTranslate < minTranslate) {
                    finalTranslate = minTranslate + (newTranslate - minTranslate) * 0.2;
                }
                
                imagesWrapper.style.transform = `translateX(${finalTranslate}%)`;
            }
        }

        function handleEnd(e) {
            if (!isDragging || !isSwiping || isAnimating) return;

            let newIndex = currentIndex;
            
            // Use the last direction of movement to determine next index
            if (lastDirection === 'left') {
                newIndex = currentIndex + 1;
            } else if (lastDirection === 'right') {
                newIndex = currentIndex - 1;
            }
            
            // Ensure index is within bounds
            newIndex = Math.max(0, Math.min(newIndex, images.length - 1));
            
            if (newIndex !== currentIndex) {
                currentIndex = newIndex;
            }
            
            snapToIndex(currentIndex);

            startX = 0;
            startY = 0;
            lastDirection = null;
            isDragging = false;
            isSwiping = false;
        }

        function snapToIndex(index) {
            // Add transition for smooth snapping
            imagesWrapper.style.transition = 'transform 0.3s ease-out';
            const offset = -index * 100;
            imagesWrapper.style.transform = `translateX(${offset}%)`;
            updatePagination();
            
            // Reset animation state after transition
            setTimeout(() => {
                imagesWrapper.style.transition = 'none';
                isAnimating = false;
            }, 300);
        }

        function padNumber(number) {
            return number < 10 ? `0${number}` : number;
        }

        function updatePagination() {
            if (pagination) {
                pagination.textContent = `${padNumber(currentIndex + 1)} / ${padNumber(images.length)}`;
            }
        }
        
        // Reset transition when animation ends
        imagesWrapper.addEventListener('transitionend', () => {
            imagesWrapper.style.transition = 'none';
        });
    });
} 