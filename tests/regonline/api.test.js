const expect = require('expect');
const request = require('supertest');
const roReq = require('../../regonline/requests');
const service = require('../../helper/constants').REGONLINE.SERVICE;
const EventDAO = require('../../regonline/events/dao'); 
const {connection} = require('../../db/connect');
describe('RegOnline API Requests', () => {

  describe('POST /GetEvents', () => {
    it('should get back all Events', (done) => {

      roReq({filter: '', orderBy: ''}, service.GET_EVENTS)
        .then((result) => {
            const events = result.ResultsOfListOfEvent.Data.APIEvent;
            expect(events.length).toBe(70);
            done()
        })
        .catch((e) => {
          done(e);
        })
    })
    it('should push events to database', (done) => {

      EventDAO.upsertEventsToDB({filter: '', orderBy: ''})
      .then((eventIds) => {
        console.log(eventIds);
        done();
      })
      .catch((e) => {
        done(e);
      })

    })    

  })
})