'use strict';
const {emitter} = require('../../config/config');
const regonlineReqs = require('../../regonline/requests');
const service = require('../../helper/constants').REGONLINE.SERVICE;
const {processApiArray} = require('../../helper/utils');
const DOFactory = require('../../helper/utils').DataObjectFactory;
const EventSchema = require('./schema');
const {conn,getCollection,iterateCollection,upsertOne}
  = require('../../db/connect');

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

  function processEvents(events){
    return events.map((event) => {
      return DOFactory(event, EventSchema);
    });
  };

  function insertEvents(docs){
    return conn.then((db) => {
      return db.collection('regonlineEvents').insertMany(docs);
    });
  };

  function upsertOneEvent(doc) {
    return upsertOne(doc, 'regonlineEvents');
  };

  function upsertAllEvents(eventsArr) {
    let promises = [];

    eventsArr.forEach((doc) => {
      promises.push(upsertOneEvent(DOFactory(doc, EventSchema)));
    });

    return Promise.all(promises);
  };

  // Returns a Promise with the results of the insert
  function insertEventsToDB(form) {

    return getEvents(form)
      .then(processEvents)
      .then(insertEvents)
      .then((result) => {
        return result;
      });
  };

  // Returns a Promise with the results of the upsert
  function upsertEventsToDB(form) {

    return getEvents(form)
      .then(upsertAllEvents);
  };

  return {
    getEvent,
    getEvents,
    insertEventsToDB,
    upsertEventsToDB
  };

};

const dao = EventsDAO();

dao.upsertEventsToDB({filter: '', orderby: ''})
  .then((results) => {
    console.log(results);
  })
  .catch((err) => {
    console.log(err);
  })

module.exports = dao;
