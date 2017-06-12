'use strict';
const fs = require('fs');
const path = require('path');

const Promise = require("bluebird");
const winston = require('winston');

const logDir = path.join(__dirname, 'log');

const tsFormat = () => (new Date()).toLocaleTimeString();

// Create the log directory if it does not exist
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const logger = new (winston.Logger)({
  transports: [
    // colorize the output to the console
    new (winston.transports.Console)({
      name: 'debugLogger',
      timestamp: tsFormat,
      colorize: true,
      level: 'debug'
    }),
    new (winston.transports.File)({
      name: 'infoLogger',
      filename: path.join(logDir, 'info.log'),
      timestamp: tsFormat,
      level: 'info'
    }),
    new (winston.transports.File)({
      name: 'errorLogger',
      filename: path.join(logDir, 'error.log'),
      timestamp: tsFormat,
      level: 'error'
    })    
  ]
});

module.exports = {logger};
