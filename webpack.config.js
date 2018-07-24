const path = require('path');
const OptimizeJsPlugin = require('optimize-js-plugin');

module.exports = {
  entry: {
    sw: './sw.js',
    main: './js/main.js',
    restaurant_info: './js/restaurant_info.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', { loader: 'css-loader', options: { importLoaders: 1 } }]
      }
    ]
  },
  plugins: [
    new OptimizeJsPlugin({
      sourceMap: false
    })
  ]
};
