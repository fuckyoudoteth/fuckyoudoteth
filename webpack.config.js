var path = require('path')
module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'app.js',
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
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    port: 9000,
    proxy: {
      '/api': 'http://localhost:8080'
    }
  }
}