// next.config.mjs

const nextConfig = {
	output: 'export',
	typescript: {
		ignoreBuildErrors: true,
	},
	eslint: {
		ignoreDuringBuilds: true,
	},
	distDir: '.next',

	// Add this section to exclude API routes
	pageExtensions: ['js', 'jsx', 'ts', 'tsx'].filter((ext) => {
		// During build, filter out API routes
		return process.env.NODE_ENV === 'production'
			? !process.argv.includes('build') || !ext.includes('api')
			: true;
	}),
};

export default nextConfig;
