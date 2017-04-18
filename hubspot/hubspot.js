const {Collection} = require('../db/collection');
const {RegOnline} = require('../regonline/regonline');
const API = require('./requests').HubSpotAPI;
const Fields = new Collection('fields');

const HubSpot = () => {
  return Object.assign({}, {Fields, API});
}

const conferenceFields = [];

/* Testing update and insert operations to prepare for pushing data to HubSpot

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
      const attendeeTypes = attendees.map((attendee) => {
        return attendee.hubSpotAttendeeType;
      });
      const set = new Set(attendeeTypes);
      set.forEach((value) => { 
        console.log(value)
        field.values.push(value);
      });

    });
    console.log(conferenceFields)
    const promises = conferenceFields.map((field) => {
      console.log(field.values)
      return HubSpot().Fields.updateOne({name: field.name}, {
        $addToSet: { values: field.values }
      }, 
      {upsert: true});
    });
    return Promise.all(promises);
  })


module.exports = {HubSpot};

*/