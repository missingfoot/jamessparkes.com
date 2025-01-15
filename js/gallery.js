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
        let touchStartX = 0;
        let touchStartY = 0;
        let isSwiping = false;

        // Initialize pagination
        updatePagination();

        // Add event listeners for buttons
        prevBtn?.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + images.length) % images.length;
            updateGallery();
        });

        nextBtn?.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % images.length;
            updateGallery();
        });

        // Add keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                prevBtn?.click();
            } else if (e.key === 'ArrowRight') {
                nextBtn?.click();
            }
        });

        // Add touch support
        if (container) {
            container.addEventListener('touchstart', handleTouchStart, { passive: false });
            container.addEventListener('touchmove', handleTouchMove, { passive: false });
            container.addEventListener('touchend', handleTouchEnd);
        }

        function handleTouchStart(e) {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
            isSwiping = false;
        }

        function handleTouchMove(e) {
            if (!touchStartX || !touchStartY) return;

            const touchEndX = e.touches[0].clientX;
            const touchEndY = e.touches[0].clientY;
            const deltaX = touchStartX - touchEndX;
            const deltaY = touchStartY - touchEndY;

            if (!isSwiping) {
                if (Math.abs(deltaX) > Math.abs(deltaY)) {
                    isSwiping = true;
                    e.preventDefault(); // Prevent vertical scrolling
                }
            } else {
                e.preventDefault();
            }
        }

        function handleTouchEnd(e) {
            if (!isSwiping) return;

            const touchEndX = e.changedTouches[0].clientX;
            const deltaX = touchStartX - touchEndX;

            if (Math.abs(deltaX) > 50) {
                if (deltaX > 0) {
                    nextBtn?.click();
                } else {
                    prevBtn?.click();
                }
            }

            touchStartX = 0;
            touchStartY = 0;
            isSwiping = false;
        }

        function updateGallery() {
            const offset = -currentIndex * 100;
            imagesWrapper.style.transform = `translateX(${offset}%)`;
            updatePagination();
        }

        function padNumber(number) {
            return number < 10 ? `0${number}` : number;
        }

        function updatePagination() {
            if (pagination) {
                pagination.textContent = `${padNumber(currentIndex + 1)} / ${padNumber(images.length)}`;
            }
        }
    });
} 