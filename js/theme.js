// js/theme.js
const STORAGE_KEY = 'theme';
const DARK = 'dark';
const LIGHT = 'light';

export function initTheme() {
    const stored = localStorage.getItem(STORAGE_KEY);
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    apply(stored ?? (prefersDark ? DARK : LIGHT));
}

export function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') ?? LIGHT;
    apply(current === DARK ? LIGHT : DARK);
}

export function getTheme() {
    return document.documentElement.getAttribute('data-theme') ?? LIGHT;
}

function apply(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEY, theme);
    document.dispatchEvent(new CustomEvent('theme-change', { detail: { theme } }));
}
