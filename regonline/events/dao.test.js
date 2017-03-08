const expect = require('expect');
const service = require('../../helper/constants').REGONLINE.SERVICE;
const dao = require('./dao.js');
const roReq = require('../requests');
const {connection} = require('../../db/connect');

describe('Event Data Access Object (EventDAO)', () => {
  before(function() {
    return connection
      .then(function(db) {
        return db.dropDatabase();
      });
  });

  it('should upsert to db Events requested from RegOnline API', function(){

      const eventIDs = []

      return dao.upsertEventsToDB({filter: '', orderBy: ''})
        .then((results) => {
          expect(results.length).toBe(5);
          return;
        })
        .then(() => {
          return roReq({filter: '', orderBy: ''}, service.GET_EVENTS);
        })
        .then((res) => {
          const events = res.data.ResultsOfListOfEvent.Data.APIEvent;
          events.forEach((event) => {
            eventIDs.push(Number(event.ID));
          })
          return connection;
        })
        .then((db) => {
          return db.collection('regonlineEvents').find({});
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
          result.forEach((event) => {
            expect(eventIDs).toInclude(event.ID);
          });
        })
  });
});


