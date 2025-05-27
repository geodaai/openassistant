import { heroui } from '@heroui/react';
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/stories/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}',
    '../packages/echarts/src/**/*.{js,ts,jsx,tsx,mdx}',
    '../packages/core/src/**/*.{js,ts,jsx,tsx,mdx}',
    '../packages/geoda/src/**/*.{js,ts,jsx,tsx,mdx}',
    '../packages/ui/src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {},
  },
  plugins: [heroui()],
};
export default config;
