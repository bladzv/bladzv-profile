import tsParser from '@typescript-eslint/parser';
import * as astroParser from 'astro-eslint-parser';
import astroPlugin from 'eslint-plugin-astro';

export default [
  {
    ignores: ['node_modules/**', 'dist/**', '.cache/**', '.astro/**'],
  },
  {
    files: ['**/*.js', '**/*.ts', '**/*.astro'],
    languageOptions: {
      parser: tsParser,
      parserOptions: { ecmaVersion: 2021, sourceType: 'module' },
    },
    plugins: { astro: astroPlugin },
    rules: {
      'no-unused-vars': 'warn',
      'no-console': 'off',
    },
  },
  {
    files: ['**/*.astro'],
    languageOptions: {
      parser: astroParser,
      parserOptions: {
        parser: tsParser,
        extraFileExtensions: ['.astro'],
      },
    },
  },
];
