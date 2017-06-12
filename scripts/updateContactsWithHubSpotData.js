
const Promise = require('bluebird')
const {chunk} = require('../helper/utils');
const {HubSpot} = require('../hubspot/hubspot');
const {RegOnline} = require('../regonline/regonline');
const {logger} = require('../logger');

let dbContacts, hsContacts;

RegOnline().Regs.find({}).toArray()
.then((regs) => {
  dbContacts = regs;

  regs = (regs.filter((reg) => {
    return regs.indexOf(reg.Email) === -1;
  })).map((reg) => {
    return reg.Email;
  })

  regs = chunk(regs, 100);
  const promises = [];
  
  regs.forEach((batch) => {
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
      const emailAddresses = [];
      const mergeAudits = res.data[vid]["merge-audits"];
      let hsRawData;

      dbContacts.forEach((contact) => {

        if (contact.Email === email){
          emailAddresses.push(email);
          hsRawData = res.data[vid];
        }

        if (mergeAudits.length) {
          mergeAudits.forEach((audit) => {

            if (emailAddresses.indexOf(audit.merged_from_email.value) === -1) {
              emailAddresses.push(audit.merged_from_email.value);
            }
            if (emailAddresses.indexOf(audit.merged_to_email.value) === -1) {
              emailAddresses.push(audit.merged_to_email.value);
            }
          })
        }

        if (emailAddresses.indexOf(contact.Email) > -1 && !hsRawData){
          hsRawData = res.data[vid];
        }
      });

      promises.push(HubSpot().Contacts.updateOne({
        "_id": email
      }, {
        $set: {hsRawData},
        $addToSet: {
          emailAddresses: {$each: emailAddresses}
        }
      }, {
        upsert:true
      }));      
    }
  });
  console.log(promises)
  return Promise.all(promises)
})
.then(() => {
  logger.info('Update contacts with HubSpot data into hsRawData subdocument');
  setTimeout(() => {
    process.emit('exit');
  }, 500);
})
.catch((err) => {
  logger.error(err);
});

