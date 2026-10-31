/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: '#00205B',
          deep: '#00307A',
          mid: '#0057A8',
          bright: '#08B2FF',
          soft: '#B8E6FF',
          mist: '#E8F6FF',
          ink: '#001433',
        },
        primary: {
          soft: '#B8E6FF',
          light: '#08B2FF',
          DEFAULT: '#0057A8',
          deep: '#00205B',
        },
        surface: {
          white: '#FFFFFF',
          mist: '#F4F8FC',
          cool: '#EDF3F9',
        },
      },
      fontFamily: {
        display: ['"Bricolage Grotesque"', 'sans-serif'],
        sans: ['Figtree', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-brand':
          'radial-gradient(ellipse 110% 70% at 0% -5%, rgba(8,178,255,0.18) 0%, transparent 50%), radial-gradient(ellipse 90% 60% at 100% 5%, rgba(0,32,91,0.08) 0%, transparent 45%), linear-gradient(165deg, #FFFFFF 0%, #F4F8FC 45%, #E8F0F8 100%)',
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
