export function updateStatusBarColor(isDark) {
    const metaStatusBar = document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]');
    if (metaStatusBar) {
        metaStatusBar.setAttribute('content', isDark ? 'black-translucent' : 'default');
    }
}

export function initTheme() {
    // Check for saved theme preference or use system preference
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
    
    // Apply the theme
    applyTheme(theme);
}

export function toggleTheme() {
    const html = document.documentElement;
    const currentTheme = html.classList.contains('dark') ? 'dark' : 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    applyTheme(newTheme);
    localStorage.setItem('theme', newTheme);
}

function applyTheme(theme) {
    const html = document.documentElement;
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    const metaStatusBar = document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]');
    
    if (theme === 'dark') {
        html.classList.add('dark');
        metaThemeColor?.setAttribute('content', '#000000');
        metaStatusBar?.setAttribute('content', 'black-translucent');
    } else {
        html.classList.remove('dark');
        metaThemeColor?.setAttribute('content', '#ffffff');
        metaStatusBar?.setAttribute('content', 'default');
    }
} 