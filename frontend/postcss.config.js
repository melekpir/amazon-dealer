module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './index.html'],
  plugins: [require('postcss-import'), require('tailwindcss'), require('autoprefixer')]
}