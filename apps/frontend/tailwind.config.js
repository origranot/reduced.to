const { join } = require('path');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [join(__dirname, 'src/**/*.{js,ts,jsx,tsx,mdx}')],
  darkMode: 'class',
  mode: 'jit',
  purge: {
    content: [join(__dirname, 'src/**/*.{js,ts,jsx,tsx,mdx}')],
  },
  theme: {
    extend: {
      keyframes: {
        fade: {
          '0%': { opacity: 0, transform: 'translateY(-50px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      },
      animation: {
        fade: 'fade 200ms ease 0s 1 normal forwards',
      },
    },
  },
  plugins: [require('@tailwindcss/typography'), require('daisyui')],
  daisyui: {
    themes: ['winter', 'dracula'],
  },
};
