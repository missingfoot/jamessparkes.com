// tailwind.config.js
export const config = {
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
        }
    },
    surfaces: 1
}; 