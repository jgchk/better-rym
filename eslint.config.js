import eslint from '@eslint/js'
import prettier from 'eslint-config-prettier'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  prettier,
  {
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      parserOptions: {
        projectService: {
          allowDefaultProject: [
            'eslint.config.js',
            'postcss.config.js',
            'drizzle.config.ts',
            'playwright.config.ts',
            'tailwind.config.ts',
            'vitest.config.ts',
            'vite.config.ts',
          ],
          defaultProject: './tsconfig.json',
        },
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        tsconfigRootDir: import.meta.dirname,
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  {
    plugins: {
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
    },
  },
  {
    ignores: [
      '**/.DS_Store',
      'node_modules',
      'build',
      'package',
      'coverage',
      'dist',
      'profiles',
      'postcss.config.cjs',
    ],
  },
  {
    rules: {
      '@typescript-eslint/unbound-method': 'off',
      '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { disallowTypeAnnotations: false },
      ],
    },
  },
)
