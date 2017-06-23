const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: {
    main: './src/index.js',
  },
  output: {
    filename: '[name].[chunkhash].js',
    path: path.join(__dirname, 'dist')
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        query: {
          babelrc: false,
          presets: ["latest", "stage-0", "react"]
        },
        exclude: /node_modules/
      },
      {
        test: /\.json$/,
        loader: 'json-loader',
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        loaders: [
          'style-loader',
          'css-loader',
        ],
      },
      {
        test: /\.sass$/,
        include: [
          path.resolve(__dirname, 'node_modules'),
        ],
        loaders: [
          'style-loader',
          'css-loader',
          'sass-loader',
        ],
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV || "development")
      }
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: function (module) {
        return module.context && module.context.indexOf('node_modules') !== -1;
      }
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest' //But since there are no more common modules between them we end up with just the runtime code included in the manifest file
    }),
    new HtmlWebpackPlugin({
      template: 'templates/index.ejs'
    }),
  ],
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    port: 9000,
    proxy: {
      '/api': 'http://localhost:8080'
    }
  }
}
