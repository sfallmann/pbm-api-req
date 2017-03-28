const {RegOnline} = require('./regonline/regonline');
const moment = require('moment');

let events;
//const yesterday = moment().subtract(1, 'days').format('YYYY, M, D');
//const today = moment();

//TODO Add StartDate Year of Event <space> RegistrationType onto Document  HubSpotAttendeeValue

RegOnline().Events
  .find({ StartDate: { $gte: new Date('2017-01-01') } })
  .toArray()
  .then((results) => {
    console.log(results.length)
    return events = results;
  })
  .then((events) => {
    events.forEach((event) => {
      
      RegOnline().Fields
        .find({EventID: event.ID, NameOnForm: { $regex: /event/i } })
        .toArray()
        .then((field) => {
          const name = field[0].NameOnReport;
          let hubSpotField = ((name.split(' '))[1]);

          if (hubSpotField instanceof Array) {
            hubSpotField = hubSpotField.join(' ');
          }

          console.log(hubSpotField);

        })

    })
  })

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
