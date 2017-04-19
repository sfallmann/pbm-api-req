const {Collection} = require('../db/collection');
const API = require('./requests').HubSpotAPI;

const Fields = new Collection('hubspotConferenceFields');
const Contacts = new Collection('hubspotContacts');

const HubSpot = () => {
  return Object.assign({}, {Fields, Contacts, API});
}

module.exports = {HubSpot};

