export function initLightbox() {
    document.addEventListener('click', (e) => {
        const avatarContainer = e.target.closest('#avatarContainer');
        const lightbox = document.getElementById('lightbox');
        
        if (avatarContainer) {
            lightbox.classList.add('active');
        }
        
        if (e.target.matches('#lightbox, #lightboxImage')) {
            lightbox.classList.remove('active');
        }
    });
} 