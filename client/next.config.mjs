/** @type {import('next').NextConfig} */
const nextConfig = {
	typescript: {
		// !! WARN !!
		// Temporarily ignore TypeScript errors during development
		ignoreBuildErrors: true,
	},
	eslint: {
		// Temporarily ignore ESLint errors during development
		ignoreDuringBuilds: true,
	},
	// Add static export configuration
	output: 'export',
	// Disable image optimization since it requires a server component
	images: {
		unoptimized: true,
	},
	// This ensures the app works with a sub-path if needed
	basePath: '',
	// Explicitly set trailing slash behavior
	trailingSlash: false,
};

export default nextConfig;
