const {HubSpot} = require('../hubspot/hubspot');
const {RegOnline} = require('../regonline/regonline');

let conferenceFields = [];

RegOnline().Regs
  .distinct("eventTitle")
  .then((results) => {
    results.forEach((title) => {
      const arr = title.split(' ')
      arr.shift();
      title = (arr.join(' '));
      conferenceFields.push({
        name: title,
        values: []
      });
    });
  })
  .then(() => {
    return RegOnline().Regs.find({}).toArray()
  })
  .then((results) => {
    conferenceFields.forEach((field) => {
      const attendees = results.filter((result) => {
        return result.eventTitle.indexOf(field.name) > -1;
      });
      attendees.forEach((attendee) => {
        field.values.push(attendee.hubSpotAttendeeType);
      });
    });
    const promises = conferenceFields.map((field) => {
      return HubSpot().Fields.findOneAndUpdate({name: field.name}, {
        $addToSet: { values: { $each:field.values } } }, {
        returnOriginal: false,
        projection: {name: 1},
        upsert: true
      });
    });
    return Promise.all(promises);
  })
  .then(() => {
    console.log('Upsert data from RegOnline Registrations Collection into HubSpot Conference Fields Collection')
  })  
  .catch(console.log);
