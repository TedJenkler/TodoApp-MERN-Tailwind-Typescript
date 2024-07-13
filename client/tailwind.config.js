/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'darkgrey': '#2B2C37',
        'mediumgrey': '#828FA3',
        'mainpurple': '#635FC7',
        'white': '#FFFFFF',
      }
    },
  },
  plugins: [],
};