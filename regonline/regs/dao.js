'use strict';
const {conn, getDb} = require('../../db/connect');
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
        if (regs) {
          return regs;
        }
      });
  };

  function returnCollection(name){
    return conn.then((db) => {
      return db.collection(name).find({});
    });
  }

  function iterateCollection(cursor){
    return new Promise((resolve, reject) => {
      cursor.toArray((err, docs) => {
        if (err) {
          reject(err);
        }
        resolve(docs);
      });
    });
  };

  returnCollection('regonlineRegs')
  .then(iterateCollection)
  .then((result) => {
    console.log(result)
  })

  function upsertRegsForEvent(form) {

    return conn.then((db) => {
      return db.collection('regonlineEvents').find({});
    })
    .then((cursor) => {
      //const arr = []
      return new Promise((resolve, reject) => {
        cursor.toArray((err, docs) => {
          if (err) {
            reject(err);
          }
          resolve(docs);
        });
      });
    })
    .then((docs) => {
      const promises = [];
      docs.forEach((doc) => {
        promises.push(getRegsForEvent({filter: '', orderBy: '', eventID: doc.ID}));
      });
      return Promise.all(promises);
    })
    .then((regs) => {
      return conn.then((db) => {
        const promises = [];
        regs.forEach((regArr) => {
          if (typeof regArr !== 'undefined'){
            regArr.forEach((reg) => {
              if (typeof reg === 'object'){
                promises.push(
                  db.collection('regonlineRegs')
                    .updateOne({ID: reg.ID},reg,{upsert: true})
                    .then((result) => {
                      return result;
                    })
                );
              }
            });
          }
        });
        return Promise.all(promises);
      });
    })
    .then((result) => {
      console.log(result)
    })
  }

  return {
    getRegsForEvent,
    upsertRegsForEvent
  }

};





module.exports = RegsDAO();

