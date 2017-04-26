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

      const hubSpotReadyData = HubSpot().API.formatField({
        name: (field.name.toLowerCase()).replace(/ /g, '_'),
        label: field.name,
        groupName: 'conferences',
        type: 'enumeration',
        fieldType: 'checkbox',
        formField: true,
        description: `Conferences field for ${field.name} events.`,
      });

      return HubSpot().Fields.updateOne({name: field.name}, {
        $set: {
          hubSpotReadyData,
        },
        $addToSet: { values: { $each:field.values } } }, {
        returnOriginal: false,
        projection: {name: 1},
        upsert: true
      });
    });
    return Promise.all(promises);
  })
  .then((results) => {
    console.log('Upsert data from RegOnline Registrations Collection into HubSpot Conference Fields Collection');
    return HubSpot().Fields.find({}).toArray()
  })
  .then((fields) => {
    const promises = fields.map((field) => {
      const options = field.values.map((value) => {
        return {
          value,
          label: value
        }
      });
      field.hubSpotReadyData.options = options;
      return HubSpot().Fields.updateOne({name: field.name}, {
          $set: {
            "hubSpotReadyData.options": options
          } 
        }, {
        returnOriginal: false,
        projection: {name: 1},
        upsert: true
      });
    });
    return Promise.all(promises);
  })
  .then(console.log)
  .catch(console.log);
