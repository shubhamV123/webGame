const winston = require('winston');
const fs = require('fs');
const logDir = 'log';

if (!fs.existsSync(logDir)) {
	fs.mkdirSync(logDir);
}
const tsFormat = () => (new Date()).toLocaleTimeString();
let logger = new(winston.Logger)({
	transports: [
		new(winston.transports.Console)({
			level: 'debug',
			timestamp: tsFormat,
			handleExceptions: true,
			colorize: true,
			json: false
		}),
		new(winston.transports.File)({
			name: 'all-file',
			handleExceptions: true,
			filename: `${logDir}/all-file.log`,
			level: 'debug',
			maxsize: 100000000,
			json: true
		}),
		new(winston.transports.File)({
			name: 'error-file',
			handleExceptions: true,
			filename: `${logDir}/error-file.log`,
			level: 'error',
			maxsize: 100000000,
			json: false
		})
	]
});

module.exports = logger;