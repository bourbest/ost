const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  mode: 'production',
  target: "node",
  entry: {
    app: path.resolve(__dirname, '../tools/initdb.js')
  },
  output: {
    path: path.resolve(__dirname, "../build"),
    filename: "initdb.js"
  },
  resolve: {
    alias: {
      sapin: path.resolve(__dirname, './sapin/index.js')
    }
  }
  //externals: [nodeExternals()],
};