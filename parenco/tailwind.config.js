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
          light: '#87CEEB',
          DEFAULT: '#87CEEB',
        },
        accent: {
          light: '#FFEB3B',
          DEFAULT: '#FFEB3B',
        }
      },
      backgroundImage: {
        'gradient-warm': 'linear-gradient(to bottom, #ffffff, #f5f5f5, #faf5f0)',
      },
    },
  },
  plugins: [],
}

