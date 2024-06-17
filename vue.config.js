const { defineConfig } = require('@vue/cli-service');

require('events').EventEmitter.defaultMaxListeners = 20; // 将MaxListeners的限制数增加到20

const publicPath = process.env.NODE_ENV === 'development' ? '' : '/Web/';

// let proxyUrl = 'http://192.168.2.238:8050';
let proxyUrl = 'http://192.168.1.92:8060';
// let proxyUrl = 'http://192.168.3.253';
// let proxyUrl = 'http://erp.ybz888.com/';
if (process.env.VUE_APP_ENV_TYPE && process.env.VUE_APP_ENV_TYPE === 'dev-test') proxyUrl = 'http://192.168.1.92:8050';

process.env.VUE_APP_VERSION = require('./package.json').version;

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
      '/AfterSaleImage': { // 代理正式图片地址
        target: proxyUrl,
        ws: true, // 开启websockets
        changeOrigin: true, // 开启代理
      },
      '/Certificate': { // 代理正式图片地址
        target: 'http://192.168.1.92:8050',
        ws: true, // 开启websockets
        changeOrigin: true, // 开启代理
      },
      '/License': { //
        target: proxyUrl,
        ws: true, // 开启websockets
        changeOrigin: true, // 开启代理
      },
    },
  },
  configureWebpack: {
    devtool: process.env.NODE_ENV === 'development' ? 'source-map' : false,
  },
  // ==== 处理图标乱码 向下
  css: {
    loaderOptions: {
      sass: { // 这里开始是新增的配置
        sassOptions: {
          outputStyle: 'expanded',
        },
      },
    },
  },
  // ==== 处理图标乱码 向上
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
