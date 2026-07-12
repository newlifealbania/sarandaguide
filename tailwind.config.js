/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx}', './components/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        sea: {
          50: '#eef8fa',
          100: '#d5eef3',
          200: '#aedde8',
          300: '#76c3d6',
          400: '#3aa2bd',
          500: '#1f86a3',
          600: '#1b6c89',
          700: '#1b5870',
          800: '#1d4a5d',
          900: '#0e3140'
        },
        sand: {
          50: '#fdf9f3',
          100: '#f9efdd',
          200: '#f2dcb8',
          300: '#e9c48a',
          400: '#dfa75c',
          500: '#d68f3c'
        }
      },
      fontFamily: {
        display: ['var(--font-display)', 'serif'],
        sans: ['var(--font-sans)', 'sans-serif']
      }
    }
  },
  plugins: []
};
