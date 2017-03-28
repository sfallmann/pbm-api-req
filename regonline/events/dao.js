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

/**
 * Data Access Object for RegOnline Events
 */
const EventsDAO = () => {

  const Events = new Collection('regonlineEvents');

  /**
   * Request an Event from the RegOnline API
   * 
   * @param {object} form - The parameters for the request.
   */
  function getEvent(form) {

    return regonlineReqs(form, service.GET_EVENT)
      .then((result) => {
        const event = result.data.ResultsOfListOfEvent.Data.APIEvent;
        return event;
      });
  };

  /**
   * Request multiple Events from the RegOnline API
   * 
   * @param {object} form - The parameters for the request.
   */
  function getEvents(form) {

    return regonlineReqs(form, service.GET_EVENTS)
      .then((result) => {

        const events = result.data.ResultsOfListOfEvent;
  
        if (!events.Data){
          return [];
        } else if (events.Data.APIEvent instanceof Array) {
          return events.Data.APIEvent;
        } else if (events.Data.APIEvent instanceof Object){
          return [events.Data.APIEvent];
        }
         
      });
  };
  /**
   * Processes events for db insertion
   * 
   * @param {array} events - An array of Event data
   */
  function processEvents(events){
    return events.map(function(event){
      return DOFactory(event, EventSchema);
    });
  };

  /** Wrapper function for upserting Events
   * 
   * @param {array} eventsArray - Array of RegOnline Events
   */
  function upsertAllEvents(eventsArray) {
    let promises = [];
    eventsArray.forEach((doc) => {
      promises.push(Events
        .updateOne({ID: Number(doc.ID)}, DOFactory(doc, EventSchema), {upsert: true}));
    });

    return Promise.all(promises);
  };

  function insertEventsToDB(form) {

    return getEvents(form)
      .then(processEvents)
      .then(Events.insertMany.bind(Events));
  };

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

module.exports = dao;
