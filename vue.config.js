/*
 * @Author: your name
 * @Date: 2020-03-16 09:37:02
 * @LastEditTime: 2021-12-09 09:21:51
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /vue.config.js
 */
const TerserPlugin = require('terser-webpack-plugin');

const publicPath = process.env.NODE_ENV === 'development' ? '' : '/Web/';

let proxyUrl = 'http://192.168.3.68:8050';
// let proxyUrl = 'http://192.168.1.92:8030';
if (process.env.VUE_APP_BASE_URL && process.env.VUE_APP_BASE_URL === 'test-development-8520') proxyUrl = 'http://192.168.1.92:8050';

module.exports = {
  productionSourceMap: process.env.NODE_ENV === 'development', // 是否打包sourcemap
  outputDir: 'myDist',
  publicPath,
  devServer: {
    proxy: {
      '/Api': {
        // target: 'http://192.168.1.92:8030',
        target: proxyUrl,
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
