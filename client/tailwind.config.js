/** @type {import('tailwindcss').Config} */
module.exports = {
	// ...existing config
	theme: {
		extend: {
			colors: {
				// Mid-century color palette
				primary: 'oklch(59% 0.28 28)', // Rich orange
				'primary-foreground': 'oklch(98% 0.01 254)', // Off-white
				secondary: 'oklch(49% 0.22 245)', // Teal blue
				'secondary-foreground': 'oklch(98% 0.01 254)', // Off-white
				muted: 'oklch(95% 0.03 110)', // Soft cream
				'muted-foreground': 'oklch(43% 0.10 28)', // Muted brown
				accent: 'oklch(67% 0.25 158)', // Avocado green
				'accent-foreground': 'oklch(98% 0.01 254)', // Off-white
				background: 'oklch(98% 0.01 254)', // Off-white
				foreground: 'oklch(27% 0.05 254)', // Dark navy
				border: 'oklch(85% 0.07 110)', // Beige
			},
			borderRadius: {
				lg: '0.5rem',
				md: 'calc(0.5rem - 2px)',
				sm: 'calc(0.5rem - 4px)',
			},
			animation: {
				'spin-slow': 'spin 20s linear infinite',
			},
		},
	},
	// ...rest of config
};
