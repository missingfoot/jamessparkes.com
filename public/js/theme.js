// js/theme.js
// Theme is applied synchronously by the inline snippet in <head> to avoid
// a flash of the wrong theme. This file only wires up the toggle button(s);
// their icon and label ("Dark mode" / "Light mode") follow data-theme in CSS.
// There are two theme-toggle instances in the DOM (desktop sidebar + mobile
// panel), so every lookup below is a querySelectorAll, not querySelector.
(function () {
    var STORAGE_KEY = 'theme';

    function apply(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        try { localStorage.setItem(STORAGE_KEY, theme); } catch (e) {}
    }

    document.addEventListener('DOMContentLoaded', function () {
        document.querySelectorAll('[data-theme-toggle]').forEach(function (toggle) {
            toggle.addEventListener('click', function () {
                var current = document.documentElement.getAttribute('data-theme') || 'light';
                apply(current === 'dark' ? 'light' : 'dark');
            });
        });
    });
})();
