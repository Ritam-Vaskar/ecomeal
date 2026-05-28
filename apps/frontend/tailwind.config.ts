import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#0b0e14',
          900: '#0f121a',
          800: '#141a26',
          700: '#1c2433',
          600: '#2a3447',
        },
        ember: {
          400: '#ff885b',
          500: '#ff6a3d',
          600: '#e5562d',
        },
        mint: {
          300: '#7af7c6',
          400: '#4be5b0',
          500: '#2ac194',
        },
        gold: {
          400: '#f7c564',
        },
      },
      boxShadow: {
        glow: '0 0 40px rgba(255, 106, 61, 0.15)',
      },
    },
  },
  plugins: [],
};

export default config;
