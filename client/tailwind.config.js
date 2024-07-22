/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'darkbg': '#20212C',
        'darkgrey': '#2B2C37',
        'mediumgrey': '#828FA3',
        'mainpurple': '#635FC7',
        'white': '#FFFFFF',
        'red': '#EA5555',
        'black': '#000112',
        'lightbg': '#F4F7FD',
        'mainpurplehover': '#A8A4FF',
        'redhover': '#FF9898',
        'speciallight': '#E9EFFA'
      }
    },
  },
  plugins: [],
};