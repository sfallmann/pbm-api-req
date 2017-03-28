const {RegOnline} = require('./regonline/regonline');
const moment = require('moment');

let events;
//const yesterday = moment().subtract(1, 'days').format('YYYY, M, D');
//const today = moment();

//TODO Add StartDate Year of Event <space> RegistrationType onto Document  HubSpotAttendeeValue

RegOnline()
  .Events
  .find({ StartDate: { $gte: new Date('2017-01-01') } })
  .toArray()
  .then((results) => {
    console.log(results.length)
    return events = results;
  })
  .then(RegOnline().upsertRegsForEvent)
  .then((results) => {
    console.log(results.length, 'upsertRegsForEvent');
    return RegOnline().upsertFieldsForEvent(events);
  })
  .then((results) => {
    console.log(results.length, 'upsertFieldsForEvent');
  })
  .catch(console.log);

/*
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



*/
