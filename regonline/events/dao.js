'use strict';
const conn = require('../../db/connect');
const regonlineReqs = require('../../regonline/requests');
const service = require('../../helper/constants').REGONLINE.SERVICE;
const DOFactory = require('../../helper/utils').DataObjectFactory;
const EventSchema = require('./schema');


// Data Access Object for RegOnline:
function RegonlineDAO() {

  // Returns a Promise with the requested Event
  this.getEvent = (form) => {

    return regonlineReqs(form, service.GET_EVENT)
      .then((result) => {
        const event = result.ResultsOfListOfEvent.Data.APIEvent;
        Promise.resolve(event);
      });
  };

  // Returns a Promise with the requested Events
  this.getEvents = (form) => {

    return regonlineReqs(form, service.GET_EVENTS)
      .then((result) => {
        const events = result.ResultsOfListOfEvent.Data.APIEvent;
        return Promise.resolve(events);
      });
  };

  // Returns a Promise with the results of the insert
  this.insertEventsToDB = (form) => {

    return conn.then((db) => {
      this.getEvents(form)
        .then((events) => {
          events = events.map((event) => {
            return DOFactory(event, EventSchema);
          });
          db.collection('regonlineEvents')
            .insertMany(events)
            .then((result) => {
              resolve(result);
            });
        });
    });
  };

  // Returns a Promise with the results of the updates
  this.upsertEventsToDB = (form) => {
    return conn.then((db) => {
      const promises = [];
      return this.getEvents(form)
        .then((events) => {
          events = events.map((event) => {
            return DOFactory(event, EventSchema);
          });

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
        });
    });
  };
};

const dao = new RegonlineDAO();

module.exports = dao;

