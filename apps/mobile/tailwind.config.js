const baseConfig = require('@insta-dummy/theme/tailwind.config');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.{js,jsx}', './src/**/*.{js,jsx}'],
  presets: [require('nativewind/preset'), baseConfig],
};
