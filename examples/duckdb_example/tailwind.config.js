import { sqlroomsTailwindPreset } from '@sqlrooms/ui';

const preset = sqlroomsTailwindPreset();
const config = {
  ...preset,
  content: ['src/**/*.{ts,tsx}', '../../node_modules/@sqlrooms/*/dist/**/*.js'],
  theme: {
    ...preset.theme,
    extend: {
      ...preset.theme?.extend,
    },
  },
};

export default config;


