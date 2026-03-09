const path = require('path');

module.exports = [
  {
    ignores: ['node_modules/**', 'dist/**', '.cache/**', '.astro/**'],
  },
  {
    files: ['**/*.js', '**/*.ts', '**/*.astro'],
    languageOptions: {
      parser: require('@typescript-eslint/parser'),
      parserOptions: { ecmaVersion: 2021, sourceType: 'module' },
    },
    plugins: { astro: require('eslint-plugin-astro') },
    rules: {
      'no-unused-vars': 'warn',
      'no-console': 'off',
    },
  },
  {
    files: ['**/*.astro'],
    languageOptions: {
      parser: require('astro-eslint-parser'),
      parserOptions: {
        parser: require('@typescript-eslint/parser'),
        extraFileExtensions: ['.astro'],
      },
    },
  },
];
