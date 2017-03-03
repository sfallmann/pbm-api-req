const expect = require('expect');
const request = require('supertest');
const roReq = require('../../regonline/requests');
const service = require('../../helper/constants').REGONLINE.SERVICE;
const EventDAO = require('../../regonline/events/dao'); 
const {connection} = require('../../db/connect');

/*
beforeEach(() => {
  connection
    .then((db) => {
      db.listCollections().toArray((err, items) => {
        if (items){
          const promises = items.map((col) => {
            db.collection(col.name).drop();
          })
          Promise.all(promises);
        }
      })
    })
})
*/

describe('RegOnline API Requests', () => {

  describe('POST /GetEvents', () => {
    it('should get back all Events', (done) => {
      done()
    })
  });

  describe('POST /GetRegistrationsForEvent', () => {
    it('should get back all Registrations for Event (ID:1111)', (done) => {

      roReq({filter: '', orderBy: '', eventID: 1111}, service.GET_REGS_FOR_EVENT)
        .then((res) => {

            const events = res.data.ResultsOfListOfRegistration.Data.APIRegistration;
            expect(events.length).toBe(3)    
            done()
        })
        .catch((e) => {
          done(e);
        })
    })
    it('should get back one Registrations for Event (ID:888)', (done) => {

      roReq({filter: '', orderBy: '', eventID: 888}, service.GET_REGS_FOR_EVENT)
        .then((res) => {
            const events = res.data.ResultsOfListOfRegistration.Data.APIRegistration;
            expect(events).toBeAn('object');
            expect(events.EventID).toBe('888');
            done()
        })
        .catch((e) => {
          done(e);
        })
    })
    it('should get back no Registrations for Event (ID:999)', (done) => {

      roReq({filter: '', orderBy: '', eventID: '999'}, service.GET_REGS_FOR_EVENT)
        .then((res) => {
            const events = res.data.ResultsOfListOfRegistration.Data.APIRegistration;
            expect(events).toNotExist();
            done()
        })
        .catch((e) => {
          done(Promise.reject(e));
        })
    })            

  })
})