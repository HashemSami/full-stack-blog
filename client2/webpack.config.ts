import * as path from "path";
import { Configuration as WebpackConfiguration } from "webpack";
import { Configuration as WebpackDevServerConfiguration } from "webpack-dev-server";

interface Configuration extends WebpackConfiguration {
  devServer?: WebpackDevServerConfiguration;
}

const config: Configuration = {
  entry: "./src/index.tsx",
  output: {
    publicPath: "/",
    path: path.resolve(__dirname, "src"),
    filename: "bundled.js",
  },
  mode: "development",
  devtool: "source-map",
  devServer: {
    port: 3000,
    historyApiFallback: { index: "index.html" },
    hot: true,
    static: {
      directory: path.join(__dirname, "src"),
    },
    liveReload: false,
    compress: true,
  },
  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              "@babel/preset-env",
              "@babel/preset-react",
              "@babel/preset-typescript",
            ],
          },
        },
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js", ".json"],
  },
};

export default config;
