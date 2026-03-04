import type { Config } from 'tailwindcss';
import nativewindPreset from 'nativewind/preset';
import baseConfig from '@insta-dummy/theme/tailwind.config';

const config: Config = {
  content: ['./App.{ts,tsx}', './src/**/*.{ts,tsx}'],
  presets: [nativewindPreset, baseConfig],
};

export default config;
