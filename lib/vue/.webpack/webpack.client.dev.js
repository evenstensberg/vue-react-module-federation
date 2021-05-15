const { join } = require("path");
const webpack = require("webpack");
const ModuleFederationPlugin = webpack.container.ModuleFederationPlugin;
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { VueLoaderPlugin } = require("vue-loader");

const isDev = true;

module.exports = {
  devtool: "inline-source-map",
  entry: {
    main: "./src/index.js"
  },
  mode: "development",
  output: {
    path: join(__dirname, "..", "public"),
    filename: "js/[name].bundle.[fullhash].js",
    chunkFilename: "chunks/[name].chunk.[fullhash].js"
  },
  target: "web",
  module: {
    rules: [
      {
        test: /\.m?jsx?$/,
        exclude: (file) => {
          // always transpile js in vue files
          if (/\.vue\.jsx?$/.test(file)) {
            return false
          }
          // Don't transpile node_modules
          return /node_modules/.test(file)
        },
        use: ['thread-loader', 'babel-loader'],
      },
      {
        test: /\.vue$/,
        use: "vue-loader",
      },
      {
        test: /\.(jpg|jpeg|png|gif|svg|pdf|ico)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[path][name]-[fullhash:8].[ext]"
            }
          }
        ]
      },
      {
        test: /\.css$|sass$|\.scss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
            }
          },
          {
            loader: "css-loader",
            options: {
              sourceMap: isDev
            }
          },
          {
            loader: "postcss-loader",
          },
          {
            loader: "sass-loader",
            options: {
              sourceMap: isDev
            }
          }
        ]
      },
      {
        test: /\.svg$/,
        use: [
          {
            loader: "svg-inline-loader",
            options: {
              limit: 10 * 1024,
              noquotes: true
            }
          },
          {
            loader: "url-loader",
            options: {
              limit: 10 * 1024
            }
          },
          {
            loader: "file-loader",
            options: {
              name: "[path][name].[ext]",
              outputPath: "images/",
              emitFile: false
            }
          }
        ]
      },
    ]
  },
  optimization: {
    splitChunks: {
      chunks: "all"
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development')
    }),
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: join(__dirname, "..", "index.html"),
      inject: true
    }),
    new MiniCssExtractPlugin({
      filename: "css/[name].bundle.[fullhash].css",
      chunkFilename: "chunks/[id].chunk.[fullhash].css"
    }),
    new VueLoaderPlugin(),
    new ModuleFederationPlugin({
      name: "core",
      filename: "remoteEntry.js",
      exposes: {
        "./App": "./src/App"
      },
    }),
  ],
  stats: {
    children: true,
    errorDetails: true
  },
  resolve: {
    extensions: [".vue", ".jsx", ".js", ".json"],
  },
};
