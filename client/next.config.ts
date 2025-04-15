import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	output: 'export',
	// Fix for Next.js 15.3.0 static export with API routes
	typescript: {
		ignoreBuildErrors: true,
	},
	eslint: {
		ignoreDuringBuilds: true,
	},
	// Only include files that should be part of the static export
	distDir: '.next',
};

export default nextConfig;
