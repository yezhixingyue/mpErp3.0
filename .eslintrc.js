module.exports = {
  root: true,
  env: {
    node: true,
    'vue/setup-compiler-macros': true,
  },
  extends: [
    'plugin:vue/essential',
    '@vue/airbnb',
    '@vue/typescript/recommended',
  ],
  parserOptions: {
    ecmaVersion: 2020,
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'linebreak-style': [0, 'error', 'window'],
    'no-underscore-dangle': 'off',
    'arrow-parens': 'off',
    'max-len': ['error', { code: 160 }],
    'import/no-cycle': 'off',
    'import/no-unresolved': 'off',
    '@typescript-eslint/no-var-requires': 0,
    'vue/multi-word-component-names': 'off',
    'import/prefer-default-export': 'off',
    'vuejs-accessibility/click-events-have-key-events': 'off',
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': ['error'],
    'no-use-before-define': 'off',
    'vuejs-accessibility/label-has-for': 'off',
    'no-unused-expressions': 'off',
    'vuejs-accessibility/alt-text': 'off',
    '@typescript-eslint/no-empty-function': 'off',
    'object-curly-newline': 'off',
    'vuejs-accessibility/mouse-events-have-key-events': 'off',
    'vuejs-accessibility/form-control-has-label': 'off',
    'import/extensions': 'off',
    'import/order': 'off',
    '@typescript-eslint/no-this-alias': 'off',
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
