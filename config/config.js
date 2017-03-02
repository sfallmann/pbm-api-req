const EventEmitter = require('events');

const env = process.env.NODE_ENV || 'development';

if (env === 'development' || env === 'test') { 
  const config = require('./config.json');
  const envConfig = config[env];

  Object.keys(envConfig).forEach((key) => {
    process.env[key] = envConfig[key];
  });
}

class Emitter extends EventEmitter {}
const emitter = new Emitter();

/*
process.on('unhandledRejection', function(reason, promise) {
  logger.error('Unhandled rejection', {reason: reason, promise: promise});
});


class Emitter extends EventEmitter {}
const emitter = new Emitter();
emitter.on('error', (err) => {
  logger.error('Unexpected error on emitter', err);
});


*/
module.exports = {
  logger:  console,
  emitter
};
