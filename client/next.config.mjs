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
};

export default nextConfig;
