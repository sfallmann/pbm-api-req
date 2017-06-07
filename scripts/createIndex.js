const {HubSpot} = require('../hubspot/hubspot');
const {RegOnline} = require('../regonline/regonline');

RegOnline().Events.createIndex({ID: 1}, {unique: true})
  .then(() => {
    console.log('Create RegOnline Events index:Complete')
  })
  .catch(console.log);

RegOnline().Regs.createIndex({ID: 1}, {unique: true})
  .then(() => {
    console.log('Create RegOnline Registrations index:Complete')
  })
  .catch(console.log);  

RegOnline().Fields.createIndex({ID: 1}, {unique: true})
  .then(() => {
    console.log('Create RegOnline Custom Fields index:Complete')
  })
  .catch(console.log);  

HubSpot().Fields.createIndex({name: 1}, {unique: true})
  .then(() => {
    console.log('Create Hubspot Conference Fields index:Complete')
  })
  .catch(console.log);

HubSpot().Contacts.createIndex({_id: 1}, {unique: true})
  .then(() => {
    console.log('Create Hubspot Contacts index:Complete')
  })
  .catch(console.log);  