'use strict';
const regonlineReqs = require('../../regonline/requests');
const service = require('../../helper/constants').REGONLINE.SERVICE;
const {processApiArray} = require('../../helper/utils');
const DOFactory = require('../../helper/utils').DataObjectFactory;
const RegSchema = require('./schema');
const {Collection} = require('../../db/collection');
const {Events} = require('../events/dao');
const {connection,queryCollection,toArray,upsertOne}
  = require('../../db/connect');

/**
 * Data Access Object for RegOnline Registrations
 */
const RegsDAO = () => {

  

  const Regs = new Collection('regonlineRegs');
  const eventIDMap = Object.create(null);

  /**
   * Request Registrations for an Event from the RegOnline API
   * 
   * @param {object} form - The parameters for the request.
   */
  function getRegsForEvent(form) {

    return regonlineReqs(form, service.GET_REGS_FOR_EVENT)
      .then((result) => {

        const regs = result.data.ResultsOfListOfRegistration
        if (!regs.Data) {
          return [];
        } else if (regs.Data.APIRegistration instanceof Array) {
          return regs.Data.APIRegistration;
        } else if (regs.Data.APIRegistration instanceof Object){
          return [regs.Data.APIRegistration];
        }
      });
  };

  /**
   * Requests Registrations for each Event in the array
   * 
   * @param {array} events - Array of RegOnline EventIDs
   */
  function processRegs(events, filter) {
    
    const promises = events.map((event) => {
      
      eventIDMap[event.ID] = event;
      return getRegsForEvent({filter, orderBy: '', eventID: event.ID});
    })
    return Promise.all(promises);
  }

  /** Upsert Registrations to db
   * 
   * @param {array} regsArrays - An array of Registration arrays
   * @param {object} options - Additional data to be upserted with each Registration
   */
  function upsertAllRegs(regsArrays, options) {

    let promises = [];

    regsArrays.forEach((eventRegs) => {
      let docsRegs = eventRegs.map((doc) => {
        const year = eventIDMap[doc.EventID].StartDate.getFullYear();
        const type = doc.RegistrationType;
        const inserts = {
          hubSpotAttendeeType: `${year} ${type}`,
          eventTitle: eventIDMap[doc.EventID].Title,
          eventStartDate: eventIDMap[doc.EventID].StartDate,
          eventModDate: eventIDMap[doc.EventID].ModDate,
          eventAddDate: eventIDMap[doc.EventID].AddDate,
        }
        doc = Object.assign(doc, options, inserts);
        return Regs.updateOne({ID: Number(doc.ID)}, DOFactory(doc, RegSchema), {upsert: true});
      });
      promises = promises.concat(docsRegs);
    });
    return Promise.all(promises);
  }

  /** Wrapper function for processing and upserting Registrations
   * 
   * @param {array} events - Array of RegOnline EventIDs
   * @param {object} options - Additional data to be upserted with each Registration
   */
  function upsertRegsForEvent(events, filter, options) {
    options = options || {};
    filter = filter || '';
    return processRegs(events, filter)
    .then((regArrays) => {
      return upsertAllRegs(regArrays, options);
    });
  }

  return {
    Regs,
    getRegsForEvent,
    upsertRegsForEvent
  };
};

const dao = RegsDAO();

module.exports = RegsDAO();