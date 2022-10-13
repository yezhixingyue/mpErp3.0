const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    proxy: {
      '/Api': {
        target: 'http://192.168.3.68:8090/',
        ws: true, // 开启websockets
        changeOrigin: true, // 开启代理
      },
    },
  },
});
