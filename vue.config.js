const { defineConfig } = require('@vue/cli-service');

const publicPath = process.env.NODE_ENV === 'development' ? '' : '/Web/';

let proxyUrl = 'http://192.168.3.68:8050';
// let proxyUrl = 'http://192.168.3.253';
// let proxyUrl = 'http://erp.ybz888.com/';
if (process.env.VUE_APP_BASE_URL && process.env.VUE_APP_BASE_URL === 'test-development-8520') proxyUrl = 'http://192.168.1.92:8060';

module.exports = defineConfig({
  transpileDependencies: true,
  publicPath,
  devServer: {
    proxy: {
      '/Api': {
        // target: 'http://192.168.1.92:8030',
        target: proxyUrl,
        ws: true, // 开启websockets
        changeOrigin: true, // 开启代理
      },
      '/HeadPic': { // 代理员工照片地址
        target: proxyUrl,
        ws: true, // 开启websockets
        changeOrigin: true, // 开启代理
      },
      '/Temp': { // 代理临时图片地址
        target: proxyUrl,
        ws: true, // 开启websockets
        changeOrigin: true, // 开启代理
      },
      '/Image': { // 代理正式图片地址
        target: proxyUrl,
        ws: true, // 开启websockets
        changeOrigin: true, // 开启代理
      },
    },
  },
  configureWebpack: {
    devtool: process.env.NODE_ENV === 'development' ? 'source-map' : false,
  },
  pwa: {
    iconPaths: {
      faviconSVG: 'favicon.ico',
      favicon32: 'favicon.ico',
      favicon16: 'favicon.ico',
      appleTouchIcon: 'favicon.ico',
      maskIcon: 'favicon.ico',
      msTileImage: 'favicon.ico',
    },
  },
});
