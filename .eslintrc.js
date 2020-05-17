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
    "project": "./.tsconfig.json",
    "sourceType": "module",
  },
  "plugins": [
    "@typescript-eslint",
  ],
  "rules": {
    "@typescript-eslint/no-explicit-any": [
      "off",
    ],
    "@typescript-eslint/no-inferrable-types": [
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
