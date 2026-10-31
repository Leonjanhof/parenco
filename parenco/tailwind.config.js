/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          soft: '#A8D8EA',
          light: '#4A9FC4',
          DEFAULT: '#3D8EB8',
          deep: '#2E7399',
        },
        accent: {
          soft: '#FFF4A3',
          light: '#F0D84A',
          DEFAULT: '#E8C83A',
        },
        surface: {
          mist: '#F7F8FA',
          warm: '#F3F1ED',
          paper: '#FFFFFF',
        },
      },
      fontFamily: {
        display: ['"Bricolage Grotesque"', 'sans-serif'],
        sans: ['Figtree', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-warm':
          'radial-gradient(ellipse 120% 80% at 10% -10%, #FFF8DC 0%, transparent 45%), radial-gradient(ellipse 90% 70% at 100% 0%, #D6EEF8 0%, transparent 42%), linear-gradient(165deg, #FFFFFF 0%, #F5F6F8 48%, #F0EEE9 100%)',
        'gradient-page':
          'linear-gradient(180deg, rgba(255,255,255,0.92) 0%, rgba(245,246,248,0.95) 55%, rgba(240,238,233,0.98) 100%)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'soft-pulse': {
          '0%, 100%': { opacity: '0.55' },
          '50%': { opacity: '1' },
        },
        'spin-slow': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'unwind-line': {
          '0%': { width: '0', opacity: '1' },
          '65%': { width: '180px', opacity: '1' },
          '100%': { width: '0', opacity: '0' },
        },
        'unwind-spool': {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '60%': { transform: 'scale(0.92)', opacity: '0.92' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'unwind-ring': {
          '0%': { transform: 'scale(1)', opacity: '0.8' },
          '60%': { transform: 'scale(0.9)', opacity: '0.5' },
          '100%': { transform: 'scale(0.82)', opacity: '0.28' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.55s ease-out both',
        'soft-pulse': 'soft-pulse 1.6s ease-in-out infinite',
        'spin-slow': 'spin-slow 1.1s linear infinite',
        'unwind-line': 'unwind-line 2.4s ease-in-out infinite',
        'unwind-spool': 'unwind-spool 2.4s ease-in-out infinite',
        'unwind-ring': 'unwind-ring 2.4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
