module.exports = {
  "env": {
    "browser": true,
    "es6": true
  },
  "extends": [
    "google",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
  ],
  "globals": {
    "Atomics": "readonly",
    "SharedArrayBuffer": "readonly"
  },
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaFeatures": {
      "jsx": true
    },
    "ecmaVersion": 2018,
    "sourceType": "module"
  },
  "plugins": [
    "@typescript-eslint"
  ],
  "rules": {
    "no-trailing-spaces": "off",
    "max-len": ["error", { "code": 200 }],
    "@typescript-eslint/no-explicit-any": 'off',
    "valid-jsdoc": ["error", { "requireParamType": false, "requireReturnType": false, "requireReturn": false }]
  }
};