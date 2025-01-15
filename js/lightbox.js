export function initLightbox() {
    document.addEventListener('click', (e) => {
        const avatarContainer = e.target.closest('#avatarContainer');
        const lightbox = document.getElementById('lightbox');
        
        if (avatarContainer) {
            console.log('Avatar clicked');
            lightbox.classList.add('active');
        }
        
        if (e.target.matches('#lightbox, #lightboxImage')) {
            console.log('Lightbox clicked');
            lightbox.classList.remove('active');
        }
    });
} 