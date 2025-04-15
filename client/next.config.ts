import type { NextConfig } from 'next';

const nextConfig = {
	output: 'export',
	typescript: {
		ignoreBuildErrors: true,
	},
	eslint: {
		ignoreDuringBuilds: true,
	},
	distDir: '.next',
	// Remove experimental config section entirely
} as NextConfig;

export default nextConfig;
