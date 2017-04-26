const {HubSpot} = require('../hubspot/hubspot');
let dbFields;
const hbsptFields = [];

HubSpot().Fields.find({})
  .toArray()
  .then((fields) => {
    return fields.map((field) => {
      return HubSpot().API.getContactProperty(field.hubSpotReadyData.name)
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
    const promises = [];
    hbsptFields.forEach((field) => {
      if (field.status === 200) {
        const values = [];
        const options = field.data.options.map((option) => {
          values.push(option.value);
          return {
            value: option.value,
            label: option.label
          }
        })
        promises.push(HubSpot().Fields.updateOne({"hubSpotReadyData.name": field.data.name}, {
          $addToSet: {
            "values": {$each: values},
            "hubSpotReadyData.options": {$each: options}
          } }, {
          returnOriginal: false,
          upsert: true
        }));
      }
    });
    return Promise.all(promises);
  })
  .then(() => {
    return HubSpot().Fields.find({}).toArray();
  })
  .then((fields) => {
    const promises = [];
    fields.forEach((field) => {
      const upsert = hbsptFields.filter((hsField) => {
        return hsField.name === field.hubSpotReadyData.name;
      });
      switch (upsert[0].status) {
        case 404:
          promises.push(HubSpot().API.createContactProperty(field.hubSpotReadyData));
          break;
        case 200:
          promises.push(HubSpot().API.updateContactProperty(
            field.hubSpotReadyData.name,
            field.hubSpotReadyData
            ));
          break;
      }
    })
    return Promise.all(promises);
  })
  .then(console.log)
  .catch(console.log);


