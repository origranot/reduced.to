const { join } = require('path');

module.exports = {
  plugins: {
    'tailwindcss/nesting': {},
    autoprefixer: {},
    tailwindcss: {
      config: join(__dirname, 'tailwind.config.js'),
    },
  },
};
