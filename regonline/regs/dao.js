'use strict';
const {conn, getDb, getCollection, iterateCollection} = require('../../db/connect');
const regonlineReqs = require('../../regonline/requests');
const service = require('../../helper/constants').REGONLINE.SERVICE;
const {processApi} = require('../../helper/utils');
const DOFactory = require('../../helper/utils').DataObjectFactory;
const RegSchema = require('./schema');

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

  function upsertOneReg(doc){
    return conn.then((db) => {
      return db.collection('regonlineRegs')
        .updateOne({ID: doc.ID}, doc, {upsert: true})
        .then((result) => {
          return result;
        });
      })
  }

  function upsertAllRegs(regArrays){
    let promises = [];

    regArrays.forEach((docs) => {
      let docsRegs = docs.map((doc) => {
        return upsertOneReg(DOFactory(doc, RegSchema));
      });
      promises = promises.concat(docsRegs);
    })
    return Promise.all(promises);
  }
  
  function upsertRegsForEvent(form) {

    function processRegs (docs){
      const cb = (doc) => {
        return getRegsForEvent({ filter: '', orderBy: '', eventId: doc.ID });
      }
      return processApi(docs, cb);
    }

    return getCollection('regonlineEvents', {})
    .then(iterateCollection)
    .then(processRegs) 
    .then(upsertAllRegs)
  }

  return {
    getRegsForEvent,
    upsertRegsForEvent
  }

};

let dao = RegsDAO();
dao.upsertRegsForEvent({})
  .then((results) => {
    console.log(results.length)
  })
  .catch((e) => {
    console.log(e);
  })
module.exports = RegsDAO();

