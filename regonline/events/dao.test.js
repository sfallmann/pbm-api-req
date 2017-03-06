const expect = require('expect');
const service = require('../../helper/constants').REGONLINE.SERVICE;
const dao = require('./dao.js');
const roReq = require('../requests');
const {connection} = require('../../db/connect');



describe('Event Data Access Object (EventDAO)', () => {





  it('should upsert to db Events requested from RegOnline API', function(done){
    connection
      .then((db) => {
        db.dropDatabase();

        dao.upsertEventsToDB({filter: '', orderBy: ''})
          .then((results) => {
            expect(results.length).toBe(5);
            done();
            let eventIDs = [];

            roReq({filter: '', orderBy: ''}, service.GET_EVENTS)
              .then((res) => {
                const events = res.data.ResultsOfListOfEvent.Data.APIEvent;
                events.forEach((event) => {
                  eventIDs.push(event.ID);
                });

                db.collection('regonlineEvents').find({}).toArray((err, data) => {
                  if (err){
                    done(err);
                    return;
                  }
                  let dbeventIDs = [];
                  data.forEach((event) => {
                    dbeventIDs.push(event.ID);
                  });
                  expect(dbeventIDs).toMatch([])
                  done();
                })

              })          
            })
    })
    .catch((e) => {
      done(e);
    });
   
  });
});