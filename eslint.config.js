import globals from 'globals'
import typescriptParser from '@typescript-eslint/parser'
import typescriptPlugin from '@typescript-eslint/eslint-plugin'
import prettierPlugin from 'eslint-plugin-prettier'
import eslintRecommended from '@eslint/js'
import prettierConfig from 'eslint-config-prettier'

export default [
  eslintRecommended.configs.recommended,
  prettierConfig,
  {
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
      globals: {
        ...globals.node,
        ...globals.jest,
      },
    },
    plugins: {
      '@typescript-eslint': typescriptPlugin,
      prettier: prettierPlugin,
    },
    rules: {
      semi: ['error', 'never'],
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_' },
      ],
      quotes: ['error', 'single'],
    },
  },
]
