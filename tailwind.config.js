/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./components/**/*.js",
    "./js/**/*.js"
  ],
  darkMode: ['selector', '[data-theme="dark"]'],
  theme: {
    extend: {
      fontFamily: {
        mono: ['"Maple Mono"', 'monospace'],
      },
      colors: {
        bg:           'var(--bg)',
        'bg-nav':     'var(--bg-nav)',
        border:       'var(--border)',
        text:         'var(--text)',
        'text-dim':   'var(--text-dim)',
        'active-bg':  'var(--active-bg)',
        'active-text':'var(--active-text)',
      },
    }
  },
  plugins: [],
}
