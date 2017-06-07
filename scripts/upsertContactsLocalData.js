const {HubSpot} = require('../hubspot/hubspot');
const {RegOnline} = require('../regonline/regonline');

RegOnline().Regs.aggregate(
  [
    { 
      $group: { 
        _id:  "$Email",
      conferences: {
        $addToSet: {
          name: "$eventTitle",
          attendeeType: "$hubSpotAttendeeType",
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
    return   HubSpot().Contacts.findOneAndUpdate({_id:contact._id.toLowerCase()}, 
    {$addToSet: { conferences: { $each: contact.conferences }} },
    {upsert:true})
  })
  return Promise.all(promises);
})
.then(() => {
  console.log('update db Contacts Collection')
})
.catch(console.log)
