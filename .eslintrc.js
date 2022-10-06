module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'airbnb-base',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 13,
    sourceType: 'module',
  },
  plugins: [
    'import',
    '@typescript-eslint',
  ],
  rules: {
    'import/prefer-default-export': 'off',
    'import/no-default-export': 'error',
    'import/extensions': 'off',
    'no-unused-vars': 'warn',
    'arrow-body-style': 'off',
    'max-len': ['error', { code: 140 }],
  },
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts'],
    },
    'import/resolver': {
      typescript: {
        // always try to resolve types under `<root>@types`
        // directory even it doesn't contain any source code, like `@types/unist`

        alwaysTryTypes: true,

        project: 'path/to/folder',
      },
    },
  },
};
