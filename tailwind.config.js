/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx,mdx}',
    './components/**/*.{js,jsx,ts,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: '#242424',
        graphite: '#5b5b5b',
        paper: '#f7f7f5',
        navy: '#2e4a73',
        pink: {
          50: '#fff6fa',
          100: '#fde8f2',
          200: '#f8b8d4',
          300: '#fb3ca8',
          400: '#f643a8',
          500: '#ef329d',
          600: '#ca3e90',
          700: '#a42672',
          800: '#7b1a56',
          900: '#511039',
          950: '#2b071e',
        },
      },
    },
  },
  plugins: [],
};
