const path = require('path');
const winston = require('winston');

const ERROR_LOG_PATH = path.join(__dirname, '../Logs', 'error.log');
const INFO_LOG_PATH = path.join(__dirname, '../Logs', 'info.log');
const WARN_LOG_PATH = path.join(__dirname, '../Logs', 'warn.log');
const DEBUG_LOG_PATH = path.join(__dirname, '../Logs', 'debug.log');

const Logger = winston.createLogger({
  level: 'verbose',
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'MM-DD HH:mm:ss',
    }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: INFO_LOG_PATH, level: 'info' }),
    new winston.transports.File({ filename: WARN_LOG_PATH, level: 'warn' }),
    new winston.transports.File({ filename: DEBUG_LOG_PATH, level: 'debug' }),
    new winston.transports.File({ filename: ERROR_LOG_PATH, level: 'error' }),
    new winston.transports.Console({ level: 'verbose', stderrLevels: ['error'] }),
  ],
});

module.exports = { Logger };
