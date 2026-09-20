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
    rules: {
      'no-restricted-imports': ['error', {
        patterns: [
          { group: ['features/*', 'features/**', 'app/*', 'app/**'], message: 'shared/ must not import from features/ or app/' },
        ],
      }],
    },
  },
  {
    files: ['src/features/**/*.{ts,tsx}'],
    ignores: ['src/features/auth/components/preview-card/**'],
    rules: {
      'no-restricted-imports': ['error', {
        patterns: [
          {
            group: ['app/*', 'app/**'],
            message: 'features/ must not import from app/ (inject at app boundary or use feature/shared providers)',
          },
        ],
      }],
    },
  },
  {
    ignores: ['build/**', 'node_modules/**', 'vite.config.ts'],
  },
);
