/* eslint-disable node/no-unpublished-require */
/* eslint-disable @typescript-eslint/no-var-requires */
const { resolve } = require('path')
const { IgnorePlugin } = require('webpack')

const { NODE_ENV } = process.env

module.exports = {
  entry: './src/index.ts',
  mode: NODE_ENV,
  module: {
    rules: [
      {
        include: resolve(__dirname, 'src'),
        test: /\.(graphql|sql)$/,
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
    extensions: ['.ts', '.mjs', '.js'],
  },
  target: 'node',
  watch: NODE_ENV === 'development',
  watchOptions: {
    ignored: '!src',
  },
}
