module.exports = {
  "env": {
    "browser": true,
    "es6": true,
    "node": true,
  },
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "google",
  ],
  "globals": {
    "Atomics": "readonly",
    "SharedArrayBuffer": "readonly",
  },
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaVersion": 11,
    "project": "./tsconfig.json",
    "sourceType": "module",
  },
  "plugins": [
    "@typescript-eslint",
    "only-warn",
  ],
  "rules": {
    "@typescript-eslint/no-empty-function": [
      "off",
    ],
    "@typescript-eslint/no-explicit-any": [
      "off",
    ],
    "@typescript-eslint/no-inferrable-types": [
      "off",
    ],
    "@typescript-eslint/no-non-null-assertion": [
      "off",
    ],
    "@typescript-eslint/no-unused-vars": [
      "off",
    ],
    "@typescript-eslint/no-unused-vars-experimental": [
      "warn",
    ],
    "@typescript-eslint/typedef": [
      "warn",
      {
        "arrayDestructuring": true,
        "arrowParameter": true,
        "memberVariableDeclaration": true,
        "objectDestructuring": true,
        "parameter": true,
        "propertyDeclaration": true,
        "variableDeclaration": true,
        "variableDeclarationIgnoreFunction": true,
      },
    ],
    "indent": [
      "off",
    ],
    "linebreak-style": [
      "warn",
      (require("os").EOL === "\r\n" ? "windows" : "unix"),
    ],
    "max-len": [
      "warn",
      100,
    ],
    "no-constant-condition": [
      "warn",
      {
        "checkLoops": false
      }
    ],
    "no-unused-vars": [
      "off",
    ],
    "padded-blocks": [
      "off",
    ],
    "require-jsdoc": [
      "off",
    ],
    "quotes": [
      "warn",
      "single",
    ],
    "semi": [
      "warn",
      "always",
    ],
  }
}
