// js/lightbox.js
document.addEventListener('DOMContentLoaded', function () {
    var gallery = document.querySelector('.project-images');
    if (gallery) {
        var isDown = false;
        var moved = false;
        var startX = 0;
        var startScroll = 0;

        gallery.addEventListener('mousedown', function (e) {
            isDown = true;
            moved = false;
            gallery.classList.add('dragging');
            startX = e.pageX;
            startScroll = gallery.scrollLeft;
        });

        window.addEventListener('mousemove', function (e) {
            if (!isDown) return;
            var dx = e.pageX - startX;
            if (Math.abs(dx) > 3) moved = true;
            gallery.scrollLeft = startScroll - dx;
        });

        window.addEventListener('mouseup', function () {
            isDown = false;
            gallery.classList.remove('dragging');
        });

        // Suppress the click-to-open-lightbox when the mousedown was actually a drag
        gallery.addEventListener('click', function (e) {
            if (moved) {
                e.stopPropagation();
                e.preventDefault();
            }
        }, true);
    }

    var thumbs = document.querySelectorAll('.project-thumb');
    if (!thumbs.length) return;

    var images = Array.prototype.map.call(thumbs, function (thumb) {
        var img = thumb.querySelector('img');
        return { src: img.src, alt: img.alt };
    });

    var overlay = document.createElement('div');
    overlay.className = 'lightbox';
    overlay.innerHTML =
        '<img class="lightbox-img" src="" alt="">' +
        '<div class="lightbox-controls">' +
        '<button class="lightbox-btn" data-lb-prev>←</button>' +
        '<span class="lightbox-counter"></span>' +
        '<button class="lightbox-btn" data-lb-next>→</button>' +
        '</div>';
    document.body.appendChild(overlay);

    var img = overlay.querySelector('.lightbox-img');
    var counter = overlay.querySelector('.lightbox-counter');
    var current = 0;

    function show(index) {
        current = ((index % images.length) + images.length) % images.length;
        img.src = images[current].src;
        img.alt = images[current].alt;
        counter.textContent = (current + 1) + ' / ' + images.length;
    }

    function open(index) {
        show(index);
        overlay.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function close() {
        overlay.classList.remove('open');
        document.body.style.overflow = '';
    }

    thumbs.forEach(function (thumb, i) {
        thumb.addEventListener('click', function () { open(i); });
    });

    overlay.querySelector('[data-lb-prev]').addEventListener('click', function (e) {
        e.stopPropagation();
        show(current - 1);
    });

    overlay.querySelector('[data-lb-next]').addEventListener('click', function (e) {
        e.stopPropagation();
        show(current + 1);
    });

    overlay.addEventListener('click', function (e) {
        if (e.target === overlay || e.target === img) close();
    });

    document.addEventListener('keydown', function (e) {
        if (!overlay.classList.contains('open')) return;
        if (e.key === 'ArrowRight') show(current + 1);
        else if (e.key === 'ArrowLeft') show(current - 1);
        else if (e.key === 'Escape') close();
    });

    overlay.addEventListener('wheel', function (e) {
        e.preventDefault();
        if (e.deltaY > 0 || e.deltaX > 0) show(current + 1);
        else show(current - 1);
    }, { passive: false });
});
