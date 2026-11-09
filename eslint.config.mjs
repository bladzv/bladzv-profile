import tsPlugin from '@typescript-eslint/eslint-plugin';
import astroPlugin from 'eslint-plugin-astro';

export default [
  {
    // vendor/ is a patched third-party fork; keep it close to upstream.
    ignores: ['node_modules/**', 'dist/**', '.astro/**', 'vendor/**'],
  },
  ...tsPlugin.configs['flat/recommended'].map((config) => ({
    ...config,
    files: ['**/*.js', '**/*.mjs', '**/*.ts', '**/*.astro'],
  })),
  ...astroPlugin.configs['flat/recommended'],
  {
    files: ['**/*.js', '**/*.mjs', '**/*.ts', '**/*.astro'],
    languageOptions: {
      parserOptions: { ecmaVersion: 2021, sourceType: 'module' },
    },
    rules: {
      'no-console': 'off',
    },
  },
];
