const expect = require('expect');
const service = require('../../helper/constants').REGONLINE.SERVICE;
const dao = require('./dao.js');
const eventDao = require('../events/dao');
const roReq = require('../requests');
const {connection} = require('../../db/connect');

describe('Regs Data Access Object (RegsDAO)', () => {
  before(function() {
    return connection
      .then(function(db) {
        return db.dropDatabase();
      })
  });

  it('should upsert to db Fields requested from RegOnline API', function(){

      const fieldsIDs = []
      return eventDao.upsertEventsToDB({filter: '', orderBy: ''})
      .then((res) => {
        return dao.upsertFieldsForEvent({ID: 11234}, {ID: 1, _id: 1});
      })
      .then((results) => {
        expect(results.length).toBe(3);
        return;
      })
      .then(() => {
        return roReq({pageSectionID: '1', orderBy: '', eventID: '11234'}, service.GET_CUSTOM_FIELDS);
      })
      .then((res) => {
        const fields = res.data.ResultsOfListOfCustomField.Data.APICustomField;
        fields.forEach((field) => {
          fieldsIDs.push(Number(field.ID));
        })
        return connection;
      })
      .then((db) => {
        return db.collection('regonlineFields').find({});
      })
      .then((cursor) => {
        return new Promise((resolve, reject) => {
          cursor.toArray((err, result) => {
            if (err){
              reject(err);
            }
            resolve(result);
          })
        })
      })
      .then((result) => {
        result.forEach((field) => {
          expect(fieldsIDs).toInclude(field.ID);
        });
      })
  });
});


