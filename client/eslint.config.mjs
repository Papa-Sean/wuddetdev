import nextPlugin from '@next/eslint-plugin-next';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import reactPlugin from 'eslint-plugin-react';

/** @type {import('eslint').Linter.FlatConfig[]} */
const config = [
	{
		plugins: {
			'@next/next': nextPlugin,
			'@typescript-eslint': tsPlugin,
			react: reactPlugin,
		},
		languageOptions: {
			parser: tsParser,
			parserOptions: {
				project: true,
				ecmaVersion: 'latest',
				ecmaFeatures: {
					jsx: true,
				},
			},
		},
		files: ['**/*.{js,jsx,ts,tsx}'],
		// Add this to ignore API files directly in the config
		ignores: ['src/app/api/**/*'],
		rules: {
			'@typescript-eslint/no-unused-vars': 'off',
			'@typescript-eslint/no-explicit-any': 'off', // Add this to ignore 'any' type errors
			'react/no-unescaped-entities': 'off',
			'react/prop-types': 'off',
			'react/jsx-uses-react': 'off',
			'react/react-in-jsx-scope': 'off',
		},
	},
	{
		plugins: {
			'@next/next': nextPlugin,
		},
		// Add Next.js specific rules
		rules: {
			'@next/next/no-html-link-for-pages': 'error',
			'@next/next/no-img-element': 'warn',
		},
	},
];

export default config;
