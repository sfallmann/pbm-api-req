const {HubSpot} = require('../hubspot/hubspot');
const {RegOnline} = require('../regonline/regonline');

RegOnline().Regs.find({}, {Email:1, hubSpotAttendeeType:1, eventTitle: 1})
  .toArray()
  .then((registrations) => {
    const contacts = registrations.map((reg) => {
      const arr = reg.eventTitle.split(' ')
      arr.shift();
      const conferenceField = (arr.join(' '));
      return contact = {
        email: reg.Email,
conferenceField,
        type: conferenceField,
        type: [reg.hubSpotAttendeeType]
      }
    })
    const promises = contacts.map((contact) => {
      console.log(contact)
      const update= {};
      update[contact.conferenceField] = { $each: contact.type };
      console.log(update)
      return HubSpot().Contacts.findOneAndUpdate({email: contact.email}, {
        $addToSet: update }, {
        returnOriginal: false,
        upsert: true,
        w:1
      });
    })
    return Promise.all(promises);
  })
  .then(() => {
    console.log('Upsert Data from RegOnline Registrations Collection into HubSpot Contacts Collection')
  })
  .catch(console.log);