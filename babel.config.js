module.exports = {
  // presets: [
  //   '@vue/cli-plugin-babel/preset',
  // ],
  presets: [['@babel/preset-env', { modules: false }], '@vue/babel-preset-jsx'],
  plugins: [
    [
      'component',
      {
        libraryName: 'element-ui',
        styleLibraryName: '~src/assets/css/theme',
      },
    ],
  ],
};
