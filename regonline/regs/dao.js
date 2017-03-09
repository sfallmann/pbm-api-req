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

  function processRegs(docs) {
    const cb = (doc) => {
      return getRegsForEvent({filter: '', orderBy: '', eventID: doc.ID});
    }
    return processApiArray(docs, cb);
  }

  function upsertAllRegs(regsArrays) {
    let promises = [];

    regsArrays.forEach((eventRegs) => {
      let docsRegs = eventRegs.map((doc) => {
        return Regs.updateOne({ID: doc.ID}, DOFactory(doc, RegSchema), {upsert: true});
      });
      promises = promises.concat(docsRegs);
    });
    return Promise.all(promises);
  }

  function upsertRegsForEvent(doc, project) {
    return Events.find(doc, project).toArray()
    .then(processRegs) 
    .then(upsertAllRegs);
  }

  return {
    getRegsForEvent,
    upsertRegsForEvent
  };
};

const dao = RegsDAO();

module.exports = RegsDAO();

