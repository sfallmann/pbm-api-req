'use strict';
const conn = require('../../db/connect');
const regonlineReqs = require('../../regonline/requests');
const service = require('../../helper/constants').REGONLINE.SERVICE;
const DOFactory = require('../../helper/utils').DataObjectFactory;
const EventSchema = require('./schema');

// Data Access Object for RegOnline:
const EventsDAO = () => {

  // Returns a Promise with the requested Event
  function getEvent(form) {

    return regonlineReqs(form, service.GET_EVENT)
      .then((result) => {
        const event = result.ResultsOfListOfEvent.Data.APIEvent;
        return event;
      });
  };

  // Returns a Promise with the requested Events
  function getEvents(form) {

    return regonlineReqs(form, service.GET_EVENTS)
      .then((result) => {
        const events = result.ResultsOfListOfEvent.Data.APIEvent;
        return events;
      });
  };

  // TODO https://www.regonline.com/api/default.asmx/GetRegistrations

  // Returns a Promise with the results of the insert
  function insertEventsToDB(form) {

    return getEvents(form)
      .then((events) => {
        events = events.map((event) => {
          return DOFactory(event, EventSchema);
        });

        return conn.then((db) => {
          console.log(db);
          return db.collection('regonlineEvents')
            .insertMany(events)
            .then((result) => {
              return result;
            });
        });
      });
  };

  // Returns a Promise with the results of the upsert
  function upsertEventsToDB(form) {

    return getEvents(form)
      .then((events) => {
        events = events.map((event) => {
          return DOFactory(event, EventSchema);
        });
        return conn.then((db) => {
          const promises = [];
          events.forEach((event) => {
            promises.push(
            db.collection('regonlineEvents')
              .updateOne({ID: event.ID},event,{upsert: true})
              .then((result) => {
                return result;
              })
            );
          });
          return Promise.all(promises);
        })
      })
  };

  return {
    getEvent,
    getEvents,
    insertEventsToDB,
    upsertEventsToDB
  }

};

const dao = EventsDAO();
dao.insertEventsToDB({filter: '', orderBy: ''})
  .then((doc) => {
    console.log(doc)
  })
  .catch((e) => {
    console.log(e);
  })
module.exports = dao;

