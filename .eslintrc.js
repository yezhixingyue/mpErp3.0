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
    'import/extensions': ['error', 'always', {
      js: 'never',
      vue: 'ignorePackages',
      jsx: 'never',
      ts: 'never',
      tsx: 'never',
    }],
    '@typescript-eslint/no-var-requires': 0,
    'vue/multi-word-component-names': 'off',
    'import/prefer-default-export': 'off',
    'vuejs-accessibility/click-events-have-key-events': 'off',
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': ['error'],
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
