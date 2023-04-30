module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  ignorePatterns: ["__tests__/**/*"],
  extends: ["airbnb-base", "prettier"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 13,
    sourceType: "module",
  },
  plugins: ["import", "@typescript-eslint"],
  rules: {
    quotes: ["error", "double"],
    "import/prefer-default-export": "off",
    "import/no-default-export": "error",
    "import/extensions": "off",
    "no-unused-vars": "warn",
    "arrow-body-style": "off",
    "class-methods-use-this": "warn",
    "max-len": ["error", { code: 140 }],
    "no-shadow": "off",
    "@typescript-eslint/no-shadow": ["error"],
  },
  settings: {
    "import/parsers": {
      "@typescript-eslint/parser": [".ts"],
    },
    "import/resolver": {
      typescript: {
        // always try to resolve types under `<root>@types`
        // directory even it doesn't contain any source code, like `@types/unist`

        alwaysTryTypes: true,

        project: "path/to/folder",
      },
    },
  },
};
