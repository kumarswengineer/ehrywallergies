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
            {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            }
        ],
    },
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, 'dist/' + packageInfo.name + "/"),
    },
};