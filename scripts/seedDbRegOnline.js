const {RegOnline} = require('../regonline/regonline');

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
    console.log('Seed DB with RegOnline Data: Complete')
  })
  .catch(console.log);