const nxPreset = require('@nx/jest/preset').default;

module.exports = { ...nxPreset };

// Set the NODE_ENV to test
process.env = Object.assign(process.env, {
  NODE_ENV: 'test',
});
