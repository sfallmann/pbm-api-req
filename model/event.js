'use strict'
require('../config/config');
const db = require('mongodb').MongoClient;
const regonlineReqs = require('../regonline/requests');
const service = require('../helper/constants').REGONLINE.SERVICE;

/**
 * Data Access Object for RegOnline
 */
function RegonlineDAO(){

  /** 
   * Get all event data from RegOnline and push to db
   * @method
   * @parameter {object} form - { filter: string, orderBy: string }
   * filter: "ModDate >= DateTime(YYYY, M, D)
   * orderBy: "AddBy, AddDate DESC"
   * http://developer.regonline.com/getevents-v1-1/
   * @parameter {function} callback - the callback to call on success
   */
  this.insertEventsToDB = (form, callback) => {
     
      db.connect(process.env.dbDB_URI, (err, db) => {

      regonlineReqs(form, service.GET_EVENTS)
        .then((result) => {

          const events = result.ResultsOfListOfEvent.Data.APIEvent;

          db.collection('regonlineEvents')
            .insertMany(events)
            .then((result) => {
              callback(null, result);
            })
            .catch((e) => {
              console.log(e);
            })           
        })
    })
  };

  // form = { eventID: string }
  // https://developer.regonline.com/getevent/
  this.upsertEventsToDB = (form, callback) => {

      db.connect(process.env.dbDB_URI, (err, db) => {

      regonlineReqs(form, service.GET_EVENTS)
        .then((result) => {

          const events = result.ResultsOfListOfEvent.Data.APIEvent;
          
          console.log(events);
          const results = [];

          events.forEach((event) => {
            db.collection('regonlineEvents')
              .updateOne({ID: event.ID},event,{upsert:true})
              .then((result) => {
                results.push(result);
              })
              .then(() => {
                callback(null, results);
              })
              .catch((e) => {
                console.log(e);
              })
          })
                     
        })
    })
  };

  // form = { filter: string, orderBy: string }
  // filter: "ModDate >= DateTime(YYYY, M, D)
  // orderBy: "AddBy, AddDate DESC"
  // http://developer.regonline.com/getevents-v1-1/
  this.upsertEventToDB = (form, callback) => {

      db.connect(process.env.dbDB_URI, (err, db) => {

      regonlineReqs(form, service.GET_EVENT)
        .then((result) => {
          
          const event = result.ResultsOfListOfEvent.Data.APIEvent;

          db.collection('regonlineEvents')
            .updateOne({ID: form.eventID},event,{upsert:true})
            .then((result) => {
              callback(null, result);
            })
            .catch((e) => {
              console.log(e);
            })
                      
        })
    })
  };


}

const regonline = new RegonlineDAO();

regonline.upsertEventsToDB({filter: "ModDate >= DateTime(2017, 1, 2)", orderBy: ""}, (err, result) => {

});

