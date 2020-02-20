const path = require('path')
const nodeExternals = require('webpack-node-externals')
const webpack = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const outputPath = path.resolve(__dirname, '../build')
const serverSourcePath = path.resolve(__dirname, '../server')

module.exports = env => {
  const isProd = env === 'production'
  console.log('building for', env)
  const ret = {
    mode: env,
    target: "node",
    entry: {
      app: path.resolve(serverSourcePath, './index.js')
    },
    output: {
      path: outputPath,
      filename: "backend.js"
    },
    performance: {
      hints: 'warning'
    },
    optimization: {
      nodeEnv: env,
      minimize: true
    },
    resolve: {
      alias: {
        sapin: path.resolve(__dirname, '../src/sapin/index.js')
      }
    },
    plugins: [
      new webpack.DefinePlugin({ "process.env.NODE_ENV": JSON.stringify(env) }),
      new CopyWebpackPlugin([{
        from: path.join(serverSourcePath, `./config/config.${env}.json`),
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