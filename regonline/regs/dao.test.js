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


  it('should upsert to db Regs requested from RegOnline API', function(){

      const regsIDs = []
      return eventDao.upsertEventsToDB({filter: '', orderBy: ''})
      .then((res) => {
        return eventDao.Events.find({ID:11234}).toArray();
      })
      .then(dao.upsertRegsForEvent)
      .then((results) => {
        expect(results.length).toBe(3);
        return;
      })
      .then(() => {
        return roReq({filter: '', orderBy: '', eventID: '11234'}, service.GET_REGS_FOR_EVENT);
      })
      .then((res) => {

        const regs = res.data.ResultsOfListOfRegistration.Data.APIRegistration;
        regs.forEach((reg) => {
          
          regsIDs.push(Number(reg.ID));

        })
        return connection;
      })
      .then((db) => {
        return db.collection('regonlineRegs').find({});
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
        result.forEach((reg) => {
          expect(regsIDs).toInclude(reg.ID);
        });
      })
  });
});


