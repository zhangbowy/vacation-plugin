module.exports = {
  extends: ['eslint:recommended', require.resolve('@umijs/fabric/dist/eslint')],
  globals: {
    API_PREFIX: true,
    page: true,
    REACT_APP_ENV: true,
    ICONFONT_URL: true,
    PUBLIC_PATH: true,
  },
  rules: {
    'no-nested-ternary': 0,
    'no-param-reassign': ['error', { props: false }],
    'operator-assignment': ['error', 'never'],
  },
};
