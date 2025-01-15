export function initTheme() {
    console.log('initTheme called');
    // Check for saved theme preference or use system preference
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        console.log('Setting dark theme');
        document.documentElement.classList.add('dark');
    } else {
        console.log('Setting light theme');
        document.documentElement.classList.remove('dark');
    }
}

export function toggleTheme() {
    console.log('toggleTheme called');
    document.documentElement.classList.toggle('dark');
    
    // Save preference
    if (document.documentElement.classList.contains('dark')) {
        console.log('Saving dark theme preference');
        localStorage.theme = 'dark';
    } else {
        console.log('Saving light theme preference');
        localStorage.theme = 'light';
    }
} 