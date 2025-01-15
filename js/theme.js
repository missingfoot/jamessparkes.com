export function updateStatusBarColor(isDark) {
    const metaStatusBar = document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]');
    if (metaStatusBar) {
        metaStatusBar.setAttribute('content', isDark ? 'black-translucent' : 'default');
    }
}

export function initTheme() {
    console.log('initTheme called');
    // Check for saved theme preference or use system preference
    const isDark = localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    
    if (isDark) {
        console.log('Setting dark theme');
        document.documentElement.classList.add('dark');
    } else {
        console.log('Setting light theme');
        document.documentElement.classList.remove('dark');
    }
    
    // Update status bar color on init
    updateStatusBarColor(isDark);
}

export function toggleTheme() {
    console.log('toggleTheme called');
    document.documentElement.classList.toggle('dark');
    
    const isDark = document.documentElement.classList.contains('dark');
    
    // Save preference
    if (isDark) {
        console.log('Saving dark theme preference');
        localStorage.theme = 'dark';
    } else {
        console.log('Saving light theme preference');
        localStorage.theme = 'light';
    }
    
    // Update status bar color on toggle
    updateStatusBarColor(isDark);
} 