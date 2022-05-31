const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: {
    app: "./src/app.tsx",
    background: "./src/background.ts",
    content: "./src/content.ts",
    devtools: "./src/devtools.ts",
  },
  output: {
    path: path.resolve(
      __dirname,
      process.env.MANIFEST_VERSION === "2" ? "dist-v2" : "dist"
    ),
    filename: "[name].js",
  },
  devtool: "inline-source-map",
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
  },
  module: {
    rules: [
      // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
      { test: /\.tsx?$/, loader: "ts-loader" },
    ],
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: "src/*.html", to: "[name].html" },
        {
          from:
            process.env.MANIFEST_VERSION === "2"
              ? "manifest-v2.json"
              : "manifest.json",
          to: "manifest.json",
        },
        { from: "icons/*.png" },
      ],
    }),
  ],
};
