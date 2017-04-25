const {HubSpot} = require('../hubspot/hubspot');
const Promise = require('bluebird');


const hbsptFields = [];

HubSpot().Fields.find({})
  .toArray()
  .then((fields) => {
    fields.push({name: 'enewsletter_subscription'});
    return fields.map((field) => {
      return HubSpot().API.getContactProperty(field.name)
        .then((result) => {
          return result;
        })
        .catch((err) => {
          return err;
        });
    });

  })
  .each((results) => {
    hbsptFields.push(HubSpot().API.formatResponse(results));
  })
  .then(() => {
    console.log(hbsptFields)
  })
  .catch(console.log);


