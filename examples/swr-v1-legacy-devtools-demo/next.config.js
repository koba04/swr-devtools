const path = require("path");

/**
 * @type {import('next').NextConfig}
 */
module.exports = {
  webpack(config) {
    config.resolve.alias = {
      ...config.resolve.alias,
      swr: path.resolve(__dirname, "node_modules/swr"),
    };
    return config;
  },
};
