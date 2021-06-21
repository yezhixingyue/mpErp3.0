/*
 * @Author: your name
 * @Date: 2020-03-16 09:37:02
 * @LastEditTime: 2021-06-07 09:42:10
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /vue.config.js
 */
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  productionSourceMap: process.env.NODE_ENV === 'development', // 是否打包sourcemap
  outputDir: 'myDist',
  publicPath: process.env.NODE_ENV === 'development' ? '' : '/Web/',
  devServer: {
    proxy: {
      '/Api': {
        // target: 'http://192.168.1.50:8050', // 正式
        // target: 'http://192.168.1.92:8055', // 测试
        target: 'http://192.168.3.68:8050', // 3.0
        ws: true, // 开启websockets
        changeOrigin: true, // 开启代理
      },
    },
  },
  configureWebpack: {
    optimization: {
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            ecma: undefined,
            warnings: false,
            parse: {},
            compress: {
              drop_console: true,
              drop_debugger: true,
              pure_funcs: ['console.log'], // 移除console
            },
          },
        }),
      ],
    },
    devtool: 'source-map',
  },
};