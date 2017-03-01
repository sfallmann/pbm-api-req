const EventEmitter = require('events');

const env = process.env.NODE_ENV || 'development';

if (env === 'development' || env === 'test') { 
  const config = require('./config.json');
  const envConfig = config[env];

  Object.keys(envConfig).forEach((key) => {
    process.env[key] = envConfig[key];
  });
}


/*
const debug = require('debug')('pbm-debug');
const name = 'pbm-api-req';
const winston = require('winston');

const logger = new (winston.Logger)//({exitOnError: false});
process.on('unhandledRejection', function(reason, promise) {
  logger.error('Unhandled rejection', {reason: reason, promise: promise});
});

debug('booting %s', name);
*/

class Emitter extends EventEmitter {}
const emitter = new Emitter();
emitter.on('error', (err) => {
  logger.error('Unexpected error on emitter', err);
});

logger = console;

module.exports = {
  logger,
  emitter
};
