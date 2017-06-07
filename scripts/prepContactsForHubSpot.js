
const Promise = require('bluebird')
const {chunk} = require('../helper/utils');
const {HubSpot} = require('../hubspot/hubspot');

HubSpot().Fields.find({},{"hubSpotReadyData.name": 1, "hubSpotReadyData.label": 1})
.toArray()
.then((fields) => {
  const project = Object.create(null);
  project.conferences = 1;
  fields.forEach((field) => {
    project[`hsRawData.properties.${field.hubSpotReadyData.name}`] = 1;
  });
  return HubSpot().Contacts.find({},project).toArray();
})
.then((contacts) => {
  const promises = [];
  contacts.forEach((contact) => {
    const data = Object.create(null);
    
    if (contact.conferences === undefined){
      console.log(contact)
    }
  })
})
.catch(console.log);