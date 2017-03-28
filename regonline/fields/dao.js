'use strict';
const {emitter} = require('../../config/config');
const regonlineReqs = require('../../regonline/requests');
const service = require('../../helper/constants').REGONLINE.SERVICE;
const {processApiArray} = require('../../helper/utils');
const DOFactory = require('../../helper/utils').DataObjectFactory;
const FieldSchema = require('./schema');
const {Collection} = require('../../db/collection');
const {Events} = require('../events/dao');
const {conn,getCollection,iterateCollection,upsertOne}
  = require('../../db/connect');

/**
 * Data Access Object for RegOnline CustomFields
 */
const FieldsDAO = () => {

  const Fields = new Collection('regonlineFields');

  /**
   * Request CustomFields for an Event from the RegOnline API
   * 
   * @param {object} form - The parameters for the request.
   */
  function getFieldsForEvent(form) {

    return regonlineReqs(form, service.GET_CUSTOM_FIELDS)
      .then((result) => {
        
        const fields = result.data.ResultsOfListOfCustomField;
        
        if (!fields.Data) {
          return [];
        } else if (fields.Data.APICustomField instanceof Array) {
          return fields.Data.APICustomField;
        } else if (fields.Data.APICustomField instanceof Object) {
          return[fields.Data.APICustomField];
        }
      });           
  };

  /**
   * Requests CustomFields for each Event in the array
   * 
   * @param {array} events - Array of RegOnline EventIDs
   */
  function processFields(events) {
    const promises = events.map((event) => {
      return getFieldsForEvent({pageSectionID: 1, orderBy: '', eventID: event.ID});
    })
    return Promise.all(promises);
  }

  /** Upsert CustomFields to db
   * 
   * @param {array} regsArrays - An array of CustomFields arrays
   */
  function upsertAllFields(fieldsArray) {
    let promises = [];
    fieldsArray.forEach((eventFields) => {

      let docsFields = eventFields.map((doc) => {
        return Fields.updateOne({ID: Number(doc.ID)}, DOFactory(doc, FieldSchema), {upsert: true});
      });

      promises = promises.concat(docsFields);
    });
    return Promise.all(promises);
  }

  /** Wrapper function for processing and upserting CustomFields
   * 
   * @param {array} events - Array of RegOnline EventIDs
   */
  function upsertFieldsForEvent(events) {
    return processFields(events)  
    .then(upsertAllFields);
  }

  return {
    Fields,
    getFieldsForEvent,
    upsertFieldsForEvent
  };

};

const dao = FieldsDAO();

module.exports = dao;
