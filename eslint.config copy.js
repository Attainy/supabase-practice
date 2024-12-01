import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';
import prettier from 'eslint-plugin-prettier';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';

/** @type {import('eslint').Linter.Config[]} */
export default [
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  { files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'] },
  {
    languageOptions: {
      parser: tsParser,
      globals: globals.browser,
      ecmaFeatures: { jsx: true },
    },
  },
  {
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      prettier,
    }, // Prettier 플러그인 추가
    rules: {
      ...reactHooks.configs.recommended.rules,
      'prettier/prettier': 'error', // Prettier 위반 시 ESLint 에러로 표시
      'react/react-in-jsx-scope': 'off', // React 17+ 자동 JSX 트랜스폼 허용
      '@typescript-eslint/no-unused-vars': 'warn', // 경고로 변경
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },
];
