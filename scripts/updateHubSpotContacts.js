const Promise = require('bluebird')
const {chunk} = require('../helper/utils');
const {HubSpot} = require('../hubspot/hubspot');
const {logger} = require('../logger');

HubSpot().Contacts.find({}).toArray()
.then((contact) => {
  const email = contact[0]._id;
  const data = contact[0].hubSpotReadyData;
  return HubSpot().API.createOrUpdateContact(email, data);
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
