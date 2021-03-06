module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/essential',
    '@vue/airbnb',
  ],
  parserOptions: {
    parser: 'babel-eslint',
    // parser: '@babel/eslint-parser',
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'linebreak-style': ['off', 'windows'],
    // 'max-len': 'off',
    'no-underscore-dangle': 'off',
    "arrow-parens": 'off',
    "import/no-cycle": 'off',
    'max-len': ['error', { code: 160 }],
    "object-curly-newline": "off",
    'import/no-unresolved': 'off',
    "import/extensions":  ['error', 'always', {
      'js': 'never',
      'vue': 'ignorePackages'
    }],
    "import/prefer-default-export": "off",
  },
  overrides: [
    {
      files: [
        '**/__tests__/*.{j,t}s?(x)',
        '**/tests/unit/**/*.spec.{j,t}s?(x)',
      ],
      env: {
        jest: true,
      },
    },
  ],
};
