const {RegOnline} = require('./regonline/regonline');

console.log(RegOnline());

let events;

RegOnline().upsertEventsToDB({filter: '', orderBy: ''})
  .then(() => {
    return RegOnline().Events.find({}, {ID: 1}).toArray();
  })
  .then((results) => {
    events = results;
    return events;
  })
  .then(RegOnline().upsertRegsForEvent)
  .then((results) => {
    console.log(results);
    return events;
  })
  .then(RegOnline().upsertFieldsForEvent)
  .then(console.log)
  .catch(console.log);