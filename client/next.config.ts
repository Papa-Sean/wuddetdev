import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	output: 'export',
	// Prevent Next.js from trying to process API routes at all
	typescript: {
		ignoreBuildErrors: true,
	},
	eslint: {
		ignoreDuringBuilds: true,
	},
	distDir: '.next',
	// Add this to explicitly tell Next.js which files to include/exclude
	experimental: {
		// This tells Next.js to skip API routes during build
		outputFileTracingExcludes: {
			'*': ['./src/app/api/**/*'],
		},
	},
};

export default nextConfig;
