const {HubSpot} = require('./hubspot/hubspot');

HubSpot().Fields
  .find({})
  .toArray()
  .then(console.log);