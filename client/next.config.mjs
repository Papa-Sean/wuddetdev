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
	// Static export configuration
	output: 'export',
	// Disable image optimization since it requires server component
	images: {
		unoptimized: true,
	},
	// Ensure no API routes are included in the build
	experimental: {
		// This helps avoid errors with missing API routes
		appDocumentPreloading: false,
	},
	// This ensures the app works with a sub-path if needed
	basePath: '',
	// Explicitly set trailing slash behavior
	trailingSlash: false,
};

export default nextConfig;
