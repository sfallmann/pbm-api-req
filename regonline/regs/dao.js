'use strict';
const regonlineReqs = require('../../regonline/requests');
const service = require('../../helper/constants').REGONLINE.SERVICE;
const {processApiArray} = require('../../helper/utils');
const DOFactory = require('../../helper/utils').DataObjectFactory;
const RegSchema = require('./schema');
const {connection,queryCollection,toArray,upsertOne}
  = require('../../db/connect');

// Data Access Object for RegOnline:
const RegsDAO = () => {

  // Returns a Promise with the requested Event Registrations
  function getRegsForEvent(form) {

    return regonlineReqs(form, service.GET_REGS_FOR_EVENT)
      .then((result) => {
        const regs = result.ResultsOfListOfRegistration.Data.APIRegistration;
        if (regs) {
          return regs;
        } else {
          return [];
        }
      });
  };

  function processRegs(docs) {
    const cb = (doc) => {
      return getRegsForEvent({filter: '', orderBy: '', eventId: doc.ID});
    }
    return processApiArray(docs, cb);
  }

  function upsertOneReg(doc) {
    return upsertOne(doc, 'regonlineRegs');
  }

  function upsertAllRegs(regsArrays) {
    let promises = [];

    regsArrays.forEach((eventRegs) => {
      let docsRegs = eventRegs.map((doc) => {
        return upsertOneReg(DOFactory(doc, RegSchema));
      });
      promises = promises.concat(docsRegs);
    });
    return Promise.all(promises);
  }

  function upsertRegsForEvent(form, project) {

    return queryCollection('regonlineEvents', form, project)
    .then(toArray)
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

