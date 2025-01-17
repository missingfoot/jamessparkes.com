/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./components/**/*.js",
    "./js/**/*.js"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: { light: '#f3f4f6', dark: '#111111' },
        surface: { light: '#ffffff', dark: '#1e1e1e' },
      },
      fontFamily: {
        'sans': ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'light-2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.08)',
      },
      borderRadius: {
        'global': 'var(--global-radius)',
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: 'inherit',
            a: {
              color: 'inherit',
              textDecoration: 'underline',
              fontWeight: '300',
              '&:hover': {
                color: 'inherit',
              },
            },
            'ul, ol': {
              marginTop: '0.5em',
              marginBottom: '1em',
            },
            img: {
              borderRadius: '0.5rem',
              marginTop: '2rem',
              marginBottom: '2rem',
            },
            figure: {
              marginTop: '2rem',
              marginBottom: '2rem',
            },
            figcaption: {
              marginTop: '0.5rem',
              opacity: '0.8',
              fontSize: '0.875rem',
              textAlign: 'center',
            },
          },
        },
      },
    }
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
} 