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

// Data Access Object for RegOnline:
const FieldsDAO = () => {

  const Fields = new Collection('regonlineFields');
  // Returns a Promise with the requested Event
  function getFieldsForEvent(form) {

    return regonlineReqs(form, service.GET_CUSTOM_FIELDS)
      .then((result) => {
        const fields = result.data.ResultsOfListOfCustomField.Data.APICustomField;
        if (fields instanceof Array) {
          return fields;
        } else if (fields instanceof Object) {
          return[fields];
        } else {
          return [];
        }
      });           
  };

  function processFields(events) {
    const promises = events.map((event) => {
      return getFieldsForEvent({pageSectionID: 1, orderBy: '', eventID: event.ID});
    })
    return Promise.all(promises);
  }

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
