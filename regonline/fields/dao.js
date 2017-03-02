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
        const fields = result.ResultsOfListOfCustomField.Data.APICustomField;
        if (fields instanceof Array) {
          console.log(fields instanceof Array)
          return fields;
        } else if (fields instanceof Object) {
          return[fields];
        } else {
          return [];
        }
      });           
  };

  function processFields(docs) {
    const cb = (doc) => {
      return getFieldsForEvent({pageSectionID: 1, orderBy: '', eventID: doc.ID});
    }
    return processApiArray(docs, cb);
  }

  function upsertAllFields(fieldsArray) {
    let promises = [];
    fieldsArray.forEach((eventFields) => {

      let docsFields = eventFields.map((doc) => {
        return Fields.updateOne({ID: doc.ID}, DOFactory(doc, FieldSchema), {upsert: true});
      });

      promises = promises.concat(docsFields);
    });
    return Promise.all(promises);
  }

  function upsertFieldsForEvent(doc, project) {
    return Events.find(doc, project).toArray()
    .then(processFields) 
    .then(upsertAllFields);
  }

  return {
    getFieldsForEvent,
    upsertFieldsForEvent
  };

};

const dao = FieldsDAO();

dao.upsertFieldsForEvent({}, {ID: 1})
.then((results) => {
  console.log(results.length)
})
.catch(console.log)

module.exports = dao;
