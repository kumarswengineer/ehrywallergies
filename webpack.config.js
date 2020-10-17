const path = require('path');
const packageInfo = require('./package.json');

module.exports = {
  entry: './index.js',
  module: {
    rules: [
      {
        test: /\.html$/i,
        loader: 'html-loader',
      },
    ],
  },
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist/' + packageInfo.name + "/"),
  },
};