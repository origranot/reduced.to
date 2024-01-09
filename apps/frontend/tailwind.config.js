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
      colors: {
        'dark-modal': '#172139',
      },
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
    themes: [
      {
        winter: {
          'color-scheme': 'light',
          primary: 'oklch(56.86% 0.255 257.57)',
          secondary: '#cfe1ff',
          accent: '#C148AC',
          neutral: '#021431',
          'base-100': '#ffffff',
          'base-200': '#F2F7FF',
          'base-300': '#E3E9F4',
          'base-content': '#394E6A',
          info: '#93E7FB',
          success: '#81CFD1',
          warning: '#EFD7BB',
          error: '#E58B8B',
        },
      },
      {
        dracula: {
          'color-scheme': 'dark',
          primary: '#7c3aed',
          secondary: '#4b3eab',
          accent: '#ffb86c',
          neutral: '#414558',
          'base-100': '#0F172A',
          'base-200': '#1E293B',
          'base-content': '#f8f8f2',
          info: '#8be9fd',
          success: '#50fa7b',
          warning: '#f1fa8c',
          error: '#ff5555',
        },
      },
    ],
  },
};
