module.exports = {
  extends: "@cybozu/eslint-config/presets/react-typescript-prettier",
  rules: {
    "react/react-in-jsx-scope": "off",
    "no-nested-ternary": "off",
    "no-param-reassign": "off",
    "consistent-return": "off",
    "@typescript-eslint/no-non-null-assertion": "off"
  },
  env: {
    webextensions: true,
    node: true,
  },
};
