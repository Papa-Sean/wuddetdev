const app = require('./app');
const config = require('./config/app.config');

const PORT = config.server.port;

// Listen on all network interfaces (0.0.0.0) instead of just localhost
app.listen(PORT, '0.0.0.0', () => {
	console.log(
		`Server running on port ${PORT} in ${config.server.nodeEnv} mode`
	);
	console.log(
		`API available at http://0.0.0.0:${PORT}${config.server.apiPrefix}`
	);
});
