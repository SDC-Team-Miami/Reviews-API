const path = require("path");
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");

module.exports = {
  entry: path.resolve(__dirname, "src", "server.ts"),
  devtool: "inline-source-map",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js"],
    fallback: {
      fs: false,
      tls: false,
      net: false,
      path: false,
      zlib: false,
      http: false,
      https: false,
      stream: false,
      crypto: false,
      "crypto-browserify": require.resolve("crypto-browserify"), // if you want to use this module also don't forget npm i crypto-browserify
    },
  },
  plugins: [new NodePolyfillPlugin()],
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
};
