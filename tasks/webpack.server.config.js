const path = require('path')
const nodeExternals = require('webpack-node-externals')
const webpack = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const outputPath = path.resolve(__dirname, '../build')
const sourcePath = path.resolve(__dirname, '../src/')

module.exports = env => {
  const isProd = env === 'production'
  console.log('building for', env)
  const ret = {
    mode: env,
    target: "node",
    entry: {
      backend: path.resolve(sourcePath, './server/index.js'),
      'invoice-loader': path.resolve(sourcePath, './daemons/invoice-loader/index.js'),
      'claims-processor': path.resolve(sourcePath, './daemons/claims-processor/index.js'),
    },
    output: {
      path: outputPath,
      filename: "[name].js"
    },
    performance: {
      hints: 'warning'
    },
    optimization: {
      nodeEnv: env,
      minimize: true
    },
    plugins: [
      new webpack.DefinePlugin({ "process.env.NODE_ENV": JSON.stringify(env) }),
      new CopyWebpackPlugin([{
        from: path.join(sourcePath, `./server/config/config.${env}.json`),
        to: path.join(outputPath, './server.config.json')
      }])
    ]
  }

  console.log(ret)
  if (!isProd) {
    // in development, use node_modules to skip repacking all
    ret.externals = [nodeExternals()]
  }
  return ret
}