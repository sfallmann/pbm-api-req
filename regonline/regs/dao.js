'use strict';
const conn = require('../../db/connect');
const regonlineReqs = require('../../regonline/requests');
const service = require('../../helper/constants').REGONLINE.SERVICE;
const DOFactory = require('../../helper/utils').DataObjectFactory;
//const EventSchema = require('./schema');

// Data Access Object for RegOnline:
const RegsDAO = () => {

  // Returns a Promise with the requested Event Registrations
  function getRegsForEvent(form) {
    return regonlineReqs(form, service.GET_REGS_FOR_EVENT)
      .then((result) => {
        const regs = result.ResultsOfListOfRegistration.Data.APIRegistration;
        return regs;
      });
  };

  function upsertRegsForEvent(form) {

    return conn.then((db) => {
      return db.collection('regonlineEvents').find({})
    })
    .then((cursor) => {
        return new Promise ((resolve, reject) => {
          cursor.forEach((doc) => {
            console.log(doc)
            getRegsForEvent({filter: '', orderBy: '', eventID: doc.ID})
              .then((result) => {
                console.log(result);
              })
          });
        });
    })

  }

  return {
    getRegsForEvent,
    upsertRegsForEvent
  }

};

const dao = RegsDAO();
dao.upsertRegsForEvent();
module.exports = dao;

