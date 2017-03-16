'use strict';
const {emitter} = require('../../config/config');
const regonlineReqs = require('../../regonline/requests');
const service = require('../../helper/constants').REGONLINE.SERVICE;
const {processApiArray} = require('../../helper/utils');
const DOFactory = require('../../helper/utils').DataObjectFactory;
const EventSchema = require('./schema');
const {Collection} = require('../../db/collection');
const {connection,queryCollection,toArray,upsertOne}
  = require('../../db/connect');

// Data Access Object for RegOnline:
const EventsDAO = () => {

  const Events = new Collection('regonlineEvents');
  // Returns a Promise with the requested Event
  function getEvent(form) {

    return regonlineReqs(form, service.GET_EVENT)
      .then((result) => {
        const event = result.data.ResultsOfListOfEvent.Data.APIEvent;
        return event;
      });
  };

  // Returns a Promise with the requested Events
  function getEvents(form) {

    return regonlineReqs(form, service.GET_EVENTS)
      .then((result) => {
        const events = result.data.ResultsOfListOfEvent.Data.APIEvent;
        return events;
      });
  };

  function processEvents(events){
    return events.map(function(event){
      return DOFactory(event, EventSchema);
    });
  };

  function upsertAllEvents(eventsArray) {
    let promises = [];

    eventsArray.forEach((doc) => {
      promises.push(Events
        .updateOne({ID: Number(doc.ID)}, DOFactory(doc, EventSchema), {upsert: true}));
    });

    return Promise.all(promises);
  };

  // Returns a Promise with the results of the insert
  function insertEventsToDB(form) {

    return getEvents(form)
      .then(processEvents)
      .then(Events.insertMany.bind(Events));
  };

  // Returns a Promise with the results of the upsert
  function upsertEventsToDB(form) {

    return getEvents(form)
      .then(upsertAllEvents);
  };

  return {
    Events,
    getEvent,
    getEvents,
    insertEventsToDB,
    upsertEventsToDB
  };

};

const dao = EventsDAO();

dao.upsertEventsToDB({filter:'', orderBy: ''})
.then()
.catch(console.log);

module.exports = dao;
