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

  /**
   * Request Registrations for an Event from the RegOnline API
   * 
   * @param {object} form - The parameters for the request.
   */
  function getRegsForEvent(form) {

    return regonlineReqs(form, service.GET_REGS_FOR_EVENT)
      .then((result) => {

        const regs = result.data.ResultsOfListOfRegistration.Data.APIRegistration;

        if (regs instanceof Array) {
          return regs;
        } else if (regs instanceof Object){
          return [regs];
        } else {
          return [];
        }
      });
  };

  /**
   * Requests Registrations for each Event in the array
   * 
   * @param {array} events - Array of RegOnline EventIDs
   */
  function processRegs(events) {
    
    const promises = events.map((event) => {
      return getRegsForEvent({filter: '', orderBy: '', eventID: event.ID});
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
        doc = Object.assign(doc, options);
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
  function upsertRegsForEvent(events, options) {
    options = options || {};
    return processRegs(events)
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