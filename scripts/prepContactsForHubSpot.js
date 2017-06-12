
const Promise = require('bluebird')
const {chunk} = require('../helper/utils');
const {HubSpot} = require('../hubspot/hubspot');
const {logger} = require('../logger');

let hsFields, hsContacts;

HubSpot().Fields.find({}).toArray()
.then((fields) => {
  hsFields = fields;
  return HubSpot().Contacts.find({}).toArray()
})
.then((contacts) => {
  hsContacts = contacts;
  const promises = [];
  hsContacts.forEach((contact) => {
    const properties = [];
    const hubSpotReadyData = Object.create(null);
    hsFields.forEach((field) => {
      const values = [];
      const fieldName = field.hubSpotReadyData.name;
      if (contact.hsRawData){
        if (fieldName in contact.hsRawData.properties){
          let confVal = contact.hsRawData.properties[fieldName].value.split(';');
          confVal.forEach((val) => {
            values.push(val);
          });
        }
      }
      if (contact.conferences) {
        contact.conferences.forEach((conf) => {
          if(conf.hsName === fieldName){
            if (values.indexOf(conf.attendeeType) === -1){
              values.push(conf.attendeeType);
            }
          }
        })
      } else {
        console.log(contact._id)
      }


      if (values.length){
        properties.push({
          property: fieldName,
          value: values.join(';')
        })
      }

      if (values.length > 1){
        console.log(contact._id)
      }
    })
    hubSpotReadyData.properties = properties
    promises.push(HubSpot().Contacts.updateOne({_id:contact._id},
      {$set: {hubSpotReadyData}},
      {upsert: true}
    ))
  })
  return Promise.all(promises);
})
.then(() => {
  logger.info('Update contacts with hubSpotReadyData subdocument containing formatted data');
  setTimeout(() => {
    process.emit('exit');
  }, 500);
})
.catch((err) => {
  logger.error(err);
});
