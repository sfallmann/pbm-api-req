'use strict';
const regonlineReqs = require('../../regonline/requests');
const service = require('../../helper/constants').REGONLINE.SERVICE;
const {processApiArray} = require('../../helper/utils');
const DOFactory = require('../../helper/utils').DataObjectFactory;
const RegSchema = require('./schema');
const {Collection} = require('../../db/collection');
const {Events} = require('../events/dao');
const {connection,queryCollection,toArray,upsertOne}
  = require('../../db/connect');

// Data Access Object for RegOnline:
const RegsDAO = () => {

  const Regs = new Collection('regonlineRegs');

  // Returns a Promise with the requested Event Registrations
  function getRegsForEvent(form) {

    return regonlineReqs(form, service.GET_REGS_FOR_EVENT)
      .then((result) => {

        const regs = result.data.ResultsOfListOfRegistration.Data.APIRegistration;

        if (regs instanceof Array) {
          return regs;
        } else if (regs instanceof Object){
          return [regs];
        } else {
          return [];
        }
      });
  };

  function processRegs(events) {
    
    const promises = events.map((event) => {
      return getRegsForEvent({filter: '', orderBy: '', eventID: event.ID});
    })
    return Promise.all(promises);
  }

  function upsertAllRegs(regsArrays, options) {

    let promises = [];

    regsArrays.forEach((eventRegs) => {
      let docsRegs = eventRegs.map((doc) => {
        doc = Object.assign(doc, options);
        return Regs.updateOne({ID: Number(doc.ID)}, DOFactory(doc, RegSchema), {upsert: true});
      });
      promises = promises.concat(docsRegs);
    });
    return Promise.all(promises);
  }

  function upsertRegsForEvent(events, options) {
    options = options || {};
    return processRegs(events)
    .then((regArrays) => {
      return upsertAllRegs(regArrays, options);
    });
  }

  return {
    Regs,
    getRegsForEvent,
    upsertRegsForEvent
  };
};

const dao = RegsDAO();

Events.find({ "ModDate": { $gte: new Date("2017-01-11") } })
  .toArray()
  .then((events) => {
    return dao.upsertRegsForEvent(events, {testProp: 'this_worked!'});
  })
  .then(console.log)
  .catch(console.log);

module.exports = RegsDAO();