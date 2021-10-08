/* eslint-disable node/no-unpublished-require */
/* eslint-disable @typescript-eslint/no-var-requires */
const { resolve } = require('path')
const { NODE_ENV } = process.env
const { IgnorePlugin } = require('webpack')

module.exports = {
  entry: './src',
  mode: NODE_ENV,
  module: {
    rules: [
      {
        include: resolve(__dirname, 'src'),
        test: /\.(sql|graphql)$/,
        type: 'asset/source',
      },
      {
        include: resolve(__dirname, 'src'),
        test: /\.ts$/,
        use: 'ts-loader',
      },
    ],
  },
  node: {
    __dirname: true,
  },
  output: {
    filename: 'index.js',
    path: resolve(__dirname, 'dist'),
  },
  plugins: [new IgnorePlugin({ resourceRegExp: /^pg-native$/ })],
  resolve: {
    extensions: ['.js', '.ts'],
  },
  target: 'node',
  watch: NODE_ENV === 'development',
  watchOptions: {
    ignored: ['.yarn', 'dist'],
  },
}
