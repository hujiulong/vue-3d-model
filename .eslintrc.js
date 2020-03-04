module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/essential',
    '@vue/airbnb',
  ],
  rules: {
    'no-console': 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-useless-escape': 'off',
    'max-len': 'off',
    'import/no-extraneous-dependencies': 'off',
    'prefer-destructuring': 'off',
    'no-param-reassign': 'off',
  },
  parserOptions: {
    parser: 'babel-eslint',
  },
};
