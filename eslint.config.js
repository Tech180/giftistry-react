import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['src/**/*.{ts,tsx}'],
    plugins: {
      'react-hooks': reactHooks,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    },
  },
  {
    files: ['src/**/*.html.tsx'],
    rules: {
      'react-hooks/rules-of-hooks': 'error',
    },
  },
  {
    files: ['src/shared/**/*.{ts,tsx}'],
    ignores: ['src/shared/ui/user-preview-card/**'],
    rules: {
      'no-restricted-imports': ['error', {
        patterns: [
          { group: ['features/*', 'features/**', 'app/*', 'app/**'], message: 'shared/ must not import from features/ or app/' },
        ],
      }],
    },
  },
  {
    ignores: ['build/**', 'node_modules/**', 'vite.config.ts'],
  },
);
