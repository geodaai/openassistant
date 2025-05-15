import { nextui } from '@nextui-org/react';

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    '../node_modules/@openassistant/ui/dist/**/*.{js,ts,jsx,tsx}',
    '../node_modules/@openassistant/plots/dist/**/*.{js,ts,jsx,tsx}',
    '../node_modules/@openassistant/duckdb/dist/**/*.{js,ts,jsx,tsx}',
    '../node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  darkMode: 'class',
  plugins: [nextui()],
};
