/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    '../../node_modules/@openassistant/ui/dist/index.js',
    '../../node_modules/@openassistant/echarts/dist/index.js',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
