import js from '@eslint/js';
import globals from 'globals';
import importPlugin from 'eslint-plugin-import';
import tseslint from 'typescript-eslint';

export default tseslint.config(
	{
		ignores: ['**/node_modules/**', '**/dist/**', '**/.turbo/**'],
	},
	js.configs.recommended,
	...tseslint.configs.recommended,
	{
		files: ['**/*.{ts,tsx}'],
		languageOptions: {
			parserOptions: {
				projectService: true,
				tsconfigRootDir: import.meta.dirname,
			},
			globals: {
				...globals.browser,
				...globals.node,
			},
		},
		plugins: {
			import: importPlugin,
		},
		settings: {
			'import/resolver': {
				typescript: true,
				node: {
					extensions: ['.js', '.jsx', '.ts', '.tsx', '.d.ts', '.css'],
				},
			},
		},
		rules: {
			'import/no-unresolved': ['error', { ignore: ['^virtual:'] }],
		},
	},
);
