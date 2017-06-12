const {HubSpot} = require('../hubspot/hubspot');
const {RegOnline} = require('../regonline/regonline');
const {logger} = require('../logger');

RegOnline().Events.createIndex({ID: 1}, {unique: true})
  .then(() => {
    logger.info('Create RegOnline Events index');
    return RegOnline().Regs.createIndex({ID: 1}, {unique: true});
  })
  .then(() => {
    logger.info('Create RegOnline Registrations index');
    return RegOnline().Fields.createIndex({ID: 1}, {unique: true});
  })
  .then(() => {
    logger.info('Create RegOnline Custom Fields index');
    return HubSpot().Fields.createIndex({name: 1}, {unique: true});
  })
  .then(() => {
    logger.info('Create Hubspot Conference Fields index');  
    return HubSpot().Contacts.createIndex({_id: 1}, {unique: true});
  })
  .then(() => {
    logger.info('Create Hubspot Contacts index');
    setTimeout(() => {
      process.emit('exit');
    }, 500);    
  })
  .catch((err) => {
    logger.error(err);
  });  