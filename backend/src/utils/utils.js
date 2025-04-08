const chalk = require('chalk');

const prefix = (label, color) => {
	return chalk.bold[color](`[${label.toUpperCase()}]`);
};

const logger = {
	db: (msg) => console.log(prefix('MongoDB', 'cyan'), msg),
	auth: (msg) => console.log(prefix('Auth', 'magenta'), msg),
	server: (msg) => console.log(prefix('Server', 'green'), msg),
	routes: (msg) => console.log(prefix('Routes', 'blue'), msg),
	error: (msg) => console.error(prefix('Error', 'red'), chalk.red(msg)),
	warn: (msg) => console.warn(prefix('Warning', 'yellow'), msg),
	info: (msg) => console.log(prefix('Info', 'white'), msg),
};

module.exports = logger;
