import type { Config } from 'tailwindcss';

// Tailwind CSS theme preset – shared across all apps in the monorepo.
const config: Omit<Config, 'content'> = {
  theme: {
    extend: {
      colors: {
        brand: {
          pink: '#e1306c',
          blue: '#0095f6',
          dark: '#00376b',
        },
        ig: {
          divider: '#dbdbdb',
          bg: '#f9f9f9',
          text: '#262626',
          muted: '#8e8e8e',
          surface: '#efefef',
        },
      },
    },
  },
};

export default config;
