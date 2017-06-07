
const Promise = require('bluebird')
const {chunk} = require('../helper/utils');
const {HubSpot} = require('../hubspot/hubspot');

HubSpot().Contacts.find({}).toArray()
.then((contacts) => {
  dbContacts = contacts;

  contacts = contacts.map((contact) => {
    return contact._id;
  });

  contacts = chunk(contacts, 100);
  const promises = [];
  
  contacts.forEach((batch) => {
    promises.push(
      Promise.delay(1000).then(() => {
        return HubSpot().API.getBatchOfContactsByEmail(batch);
      })
    )
  });

  return Promise.all(promises);
})
.then((resArr) => {
  const promises = [];
  resArr.forEach((res) => {
    for (vid in res.data) {
      const email = res.data[vid].properties.email.value;
      console.log(email)
      promises.push(HubSpot().Contacts.updateOne({ "_id": email}, {$set: {hsRawData: res.data[vid]}}, {upsert:true}));
    }
  });
  return Promise.all(promises)
})
.then(console.log)
.catch(console.log);

