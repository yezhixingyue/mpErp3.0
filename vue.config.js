const { defineConfig } = require('@vue/cli-service');

const config = require('./config');

const publicPath = process.env.NODE_ENV === 'development' ? '' : `${config.path}/`;

module.exports = defineConfig({
  transpileDependencies: true,
  publicPath,
  devServer: {
    proxy: {
      '/Api': {
        target: 'http://192.168.1.92:8090/',
        // target: 'http://192.168.3.68:8090/',
        ws: true, // 开启websockets
        changeOrigin: true, // 开启代理
      },
    },
  },
});
