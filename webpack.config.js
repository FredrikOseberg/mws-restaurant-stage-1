const path = require('path');

module.exports = {
  entry: './sw.js',
  output: {
    path: path.resolve(__dirname),
    filename: 'packedSw.js'
  }
};
