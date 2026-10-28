/**
 * @type {import('next').NextConfig}
 */
module.exports = {
  turbopack: {
    resolveAlias: {
      swr: "./node_modules/swr",
    },
  },
};
