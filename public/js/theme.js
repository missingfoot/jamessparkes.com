// js/theme.js
// Theme is applied synchronously by the inline snippet in <head> to avoid
// a flash of the wrong theme. This file only wires up the toggle button.
(function () {
    var STORAGE_KEY = 'theme';

    function apply(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem(STORAGE_KEY, theme);
        var label = document.querySelector('.theme-label');
        if (label) label.textContent = theme === 'dark' ? 'light' : 'dark';
    }

    document.addEventListener('DOMContentLoaded', function () {
        var label = document.querySelector('.theme-label');
        if (label) {
            var current = document.documentElement.getAttribute('data-theme') || 'light';
            label.textContent = current === 'dark' ? 'light' : 'dark';
        }

        var toggle = document.querySelector('[data-theme-toggle]');
        if (!toggle) return;
        toggle.addEventListener('click', function () {
            var current = document.documentElement.getAttribute('data-theme') || 'light';
            apply(current === 'dark' ? 'light' : 'dark');
        });
    });
})();
