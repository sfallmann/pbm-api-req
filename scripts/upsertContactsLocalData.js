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
          attendeeType: "$hubSpotAttendeeType"
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
      return conf;
    })
  })
  return results;
})
.then((contacts) => {

  const promises = contacts.map((contact) => {
    return   HubSpot().Contacts.findOneAndUpdate({_id:contact._id}, 
    {$addToSet: { conferences: { $each: contact.conferences }} },
    {upsert:true})
  })
  return Promise.all(promises);
})
.then((results) => {
  console.log(results);
})
.catch(console.log)
