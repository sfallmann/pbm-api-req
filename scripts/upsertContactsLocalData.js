const {HubSpot} = require('../hubspot/hubspot');
const {RegOnline} = require('../regonline/regonline');
const {logger} = require('../logger');

RegOnline().Regs.aggregate(
  [
    { 
      $group: { 
        _id:  "$Email",
      conferences: {
        $addToSet: {
          name: "$eventTitle",
          attendeeType: "$hubSpotAttendeeType",
        }
      },
      modDates: {
        $addToSet: {
          modDate: "$ModDate"
        }
      }     
    },
  }
]
)
.toArray()
.then((results) => {
  results.forEach((result) => {

    result.conferences = result.conferences.map((conf) => {
      const arr = conf.name.split(' ')
      arr.shift();
      conf.name = (arr.join(' '));
      conf.hsName = (conf.name.replace(/ /g, '_')).toLowerCase();
      return conf;
    })
  })
  return results;
})
.then((contacts) => {

  const promises = contacts.map((contact) => {
    return HubSpot().Contacts.updateOne({
      emailAddresses: contact._id
    }, {
      $addToSet: { 
        conferences: { $each: contact.conferences },
        modDates: { $each: contact.modDates }
      } 
    },
    {upsert:true})
  })
  return Promise.all(promises);
})
.then(() => {
  logger.info('Update contacts with RegOnline Event registration data');
  setTimeout(() => {
    process.emit('exit');
  }, 500);
})
.catch((err) => {
  logger.error(err);
});
