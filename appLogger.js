let logger = console;

const log_level = process.env.log_level || 'warn';
const logLevels = ['trace', 'debug', 'info', 'warn', 'error'];

const pino = require('pino');

logger = pino({
	level: process.env.log_level || 'debug',
	name: 'Console Logger',
	transport: {
		target: 'pino-pretty',
		options: {
			colorize: true      
		}
	}
});

module.exports = {
  current: logger
};
