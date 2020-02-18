module.exports = {
  extends: ['airbnb-base', 'plugin:prettier/recommended'],
  env: {
    browser: true,
    jquery: true,
    greasemonkey: true,
  },
  globals: {
    SC: 'readonly',
  },
}
