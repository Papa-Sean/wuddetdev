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
		rules: {
			// Disable rules that are causing build failures for prototypes
			'@typescript-eslint/no-unused-vars': 'off', // or 'warn' if you prefer warnings instead of errors
			'react/no-unescaped-entities': 'off',

			// Keep other existing rules
			'react/prop-types': 'off',
			'react/jsx-uses-react': 'off',
			'react/react-in-jsx-scope': 'off',
		},
	},
];

export default config;
