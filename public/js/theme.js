// js/theme.js
// Theme is applied synchronously by the inline snippet in <head> to avoid
// a flash of the wrong theme. This file only wires up the toggle button(s).
// There are two theme-toggle instances in the DOM (desktop sidebar + mobile
// panel), so every lookup below is a querySelectorAll, not querySelector.
(function () {
    var STORAGE_KEY = 'theme';

    function apply(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem(STORAGE_KEY, theme);
        document.querySelectorAll('.theme-label').forEach(function (label) {
            label.textContent = theme === 'dark' ? 'light' : 'dark';
        });
    }

    document.addEventListener('DOMContentLoaded', function () {
        var current = document.documentElement.getAttribute('data-theme') || 'light';
        document.querySelectorAll('.theme-label').forEach(function (label) {
            label.textContent = current === 'dark' ? 'light' : 'dark';
        });

        document.querySelectorAll('[data-theme-toggle]').forEach(function (toggle) {
            toggle.addEventListener('click', function () {
                var current = document.documentElement.getAttribute('data-theme') || 'light';
                apply(current === 'dark' ? 'light' : 'dark');
            });
        });
    });
})();
