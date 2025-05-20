const chalk = require('chalk');
const fs = require('fs-extra');
const path = require('path');

const LOG_DIR = path.join(__dirname, '../logs');
const LOG_FILE = path.join(LOG_DIR, 'app.log');


fs.ensureDirSync(LOG_DIR);

const timestamp = () => {
	return new Date().toISOString();
};

const colorMap = {
	cyan: chalk.cyan,
	magenta: chalk.magenta,
	green: chalk.green,
	blue: chalk.blue,
	red: chalk.red,
	yellow: chalk.yellow,
	white: chalk.white,

};

const formatLog = (label, message) => `[${timestamp()}] [${label.toUpperCase()}] ${message}\n`;

// Grava no terminal e no arquivo
const writeLog = (label, color, message) => {
	const formatted = formatLog(label, message);
	const colorFn = colorMap[color] || chalk.white;

	console.log(colorFn(`[${label.toUpperCase()}]`), message);
	fs.appendFileSync(LOG_FILE, formatted, 'utf8');
};


const logger = {
	db: (msg) => writeLog('MongoDB', 'cyan', msg),
	auth: (msg) => writeLog('Auth', 'magenta', msg),
	server: (msg) => writeLog('Server', 'green', msg),
	routes: (msg) => writeLog('Routes', 'blue', msg),
	error: (msg) => writeLog('Error', 'red', chalk.red(msg)),
	warn: (msg) => writeLog('Warning', 'yellow', msg),
	info: (msg) => writeLog('Info', 'white', msg),
};

module.exports = logger;
