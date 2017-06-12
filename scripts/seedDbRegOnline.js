const {RegOnline} = require('../regonline/regonline');
const {logger} = require('../logger');

let events;

RegOnline().upsertEventsToDB({filter: 'StartDate >= DateTime(2017, 1, 1)', orderBy: ''})
  .then(() => {
    return RegOnline().Events.find({}, {}).toArray();
  })
  .then((results) => {
    events = results;
    return events;
  })
  .then(RegOnline().upsertRegsForEvent)
  .then((results) => {
    return events;
  })
  .then(RegOnline().upsertFieldsForEvent)
  .then(() => {
    logger.info('Seed DB with RegOnline Data');
    setTimeout(() => {
      process.emit('exit');
    }, 500);
  })
  .catch((err) => {
    logger.error(err);
  });