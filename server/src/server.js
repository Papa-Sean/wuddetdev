const app = require('./app');
const config = require('./config/app.config');

const PORT = config.server.port;

app.listen(PORT, () => {
	console.log(
		`Server running on port ${PORT} in ${config.server.nodeEnv} mode`
	);
	console.log(
		`API available at http://localhost:${PORT}${config.server.apiPrefix}`
	);
});
