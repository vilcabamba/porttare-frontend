const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const glob = require("glob");

// assets.js
const Assets = require('./assets');

module.exports = {
    entry: {
        app: glob.sync("./app/scripts/**/*.js")
    },
    output: {
        path: __dirname + "/wwwroot/",
        filename: "[name].bundle.js"
    },
    plugins: [
      new CopyWebpackPlugin(
        Assets.map(asset => {
          return {
            from: path.resolve(__dirname, `./node_modules/${asset}`),
            to: path.resolve(__dirname, './wwwroot/npm')
          };
        })
      )
    ]
};
