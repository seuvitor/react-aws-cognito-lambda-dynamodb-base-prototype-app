module.exports = {
  extends: [
    'airbnb-base',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended'
  ],
  env: {
    browser: true,
    jest: true
  },
  rules: {
    'linebreak-style': 0,
    'comma-dangle': ['error', 'never'],
    'no-console': ['error', { allow: ['warn', 'error'] }],
    'no-param-reassign': ['error', { props: false }]
  }
};
