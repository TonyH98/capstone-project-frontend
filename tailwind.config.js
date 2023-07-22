/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    screens: {
      'sm': '640px',
      'md': '768px',
      'lg': '993px', // Set the 'lg' breakpoint to 993px
      'xl': '1280px',
      '2xl': '1536px',
    },
  },
  plugins: [],
}
