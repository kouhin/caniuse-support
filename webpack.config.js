const fs = require("fs");
const webpack = require("webpack");
const TerserPlugin = require("terser-webpack-plugin");
const path = require("path");

const useMinification = process.env.BUILD_MINIFIED === "true";
const packageName = JSON.parse(
  fs.readFileSync("package.json", "utf8"),
).name.replace(/^@.*\//, "");
const libraryName = packageName.replace(/(^|-)(.)/g, (match, _, c) => (c ? c.toUpperCase() : ""));

/** @type {import('webpack').Configuration} */
const config = {
  entry: "./src/index.ts",
  resolve: { extensions: [".ts", ".js"] },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: "awesome-typescript-loader",
        exclude: "/node_modules/",
      },
    ],
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: useMinification ? `${packageName}.min.js` : `${packageName}.js`,
    libraryTarget: "umd",
    library: libraryName,
  },
  optimization: {
    minimize: useMinification,
    minimizer: [
      new TerserPlugin({
        extractComments: false,
      }),
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify("production"),
      },
    }),
  ],
};

// @TODO let webpack run configurations in parallel after solving:
// https://github.com/s-panferov/awesome-typescript-loader/issues/323
module.exports = config;
