const winston = require('winston');
const fs = require('fs');
const env = process.env.NODE_ENV || 'development';
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
            json: true
        }),
        new(winston.transports.File)({
            name: 'all-file',
            handleExceptions: true,
            filename: `${logDir}/all-file.log`,
            level: 'debug',
            json: true
        }),
        new(winston.transports.File)({
            name: 'error-file',
            handleExceptions: true,
            filename: `${logDir}/error-file.log`,
            level: 'error',
            json: true
        })
    ]
});

module.exports = logger;