/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: [require("postcss-nested"), require("postcss-preset-env")],
};

module.exports = config;
