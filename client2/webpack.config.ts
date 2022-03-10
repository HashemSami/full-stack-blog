import * as path from "path";
import Dotenv from "dotenv-webpack";
import { CleanWebpackPlugin } from "clean-webpack-plugin";
import HtmlWebpackHarddiskPlugin from "html-webpack-harddisk-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";
import fse from "fs-extra";
import { Configuration as WebpackConfiguration, Compiler } from "webpack";
import { Configuration as WebpackDevServerConfiguration } from "webpack-dev-server";

interface Configuration extends WebpackConfiguration {
  devServer?: WebpackDevServerConfiguration;
}

const currentTask = process.env.npm_lifecycle_event;

/*
  Because I didn't bother making CSS part of our
  webpack workflow for this project I'm just
  manually copying our CSS file to the DIST folder. 
  inside a webpack custom plugin
*/

class RunAfterCompile {
  apply(compiler: Compiler) {
    compiler.hooks.done.tap("Copy files", function () {
      fse.copySync("./src/main.css", "./dist/main.css");

      /*
        If you needed to copy another file or folder
        such as your "images" folder, you could just
        call fse.copySync() as many times as you need
        to here to cover all of your files/folders.
      */
    });
  }
}

const config: Configuration = {
  entry: "./src/index.tsx",
  output: {
    publicPath: "/",
    path: path.resolve(__dirname, "src"),
    filename: "bundled.js",
  },
  mode: "development",
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
  plugins: [
    new Dotenv(),
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: "src/index-template.html",
      alwaysWriteToDisk: true,
    }),
    new HtmlWebpackHarddiskPlugin(),
  ],
  resolve: {
    extensions: [".tsx", ".ts", ".js", ".json"],
  },
};

if (
  currentTask == "webpackDev" ||
  currentTask == "dev" ||
  currentTask == "start"
) {
  console.log(currentTask);

  config.devtool = "source-map";
  config.devServer = {
    port: 3000,
    historyApiFallback: { index: "index.html" },
    hot: true,
    static: {
      directory: path.join(__dirname, "src"),
    },
    liveReload: false,
    compress: true,
  };
}

if (currentTask == "webpackBuild" || currentTask == "build") {
  config.plugins?.push(new CleanWebpackPlugin(), new RunAfterCompile());

  config.mode = "production";

  config.output = {
    publicPath: "/",
    path: path.resolve(__dirname, "dist"),
    filename: "[name].[chunkhash].js",
    chunkFilename: "[name].[chunkhash].js",
  };
}

export default config;
