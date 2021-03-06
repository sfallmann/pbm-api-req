const expect = require('expect');
const should = require('should');
const roReq = require('./requests');
const service = require('../helper/constants').REGONLINE.SERVICE;

describe('RegOnline API Requests', () => {

  describe('POST /GetEvents', () => {
    it('should get back all Events (ID:1111)', () => {
      return roReq({filter: '', orderBy: ''}, service.GET_EVENTS)
        .then((res) => {
            const events = res.data.ResultsOfListOfEvent.Data.APIEvent;
            expect(events.length).toBe(5);
        })
    });
  });

  describe('POST /GetRegistrationsForEvent', () => {
    it('should get back all Registrations for Event (ID:1111)', () => {

      return roReq({filter: '', orderBy: '', eventID: 1111}, service.GET_REGS_FOR_EVENT)
        .then((res) => {
            const regs = res.data.ResultsOfListOfRegistration.Data.APIRegistration;
            expect(regs.length).toBe(3)

        })
    })
    it('should get back a single Registration from Event (ID:888)', () => {

      return roReq({filter: '', orderBy: '', eventID: 888}, service.GET_REGS_FOR_EVENT)
        .then((res) => {
            const regs = res.data.ResultsOfListOfRegistration.Data.APIRegistration;
            expect(regs).toBeAn('object');
            expect(regs.EventID).toBe('888');
        })
    })
    it('should get back no Registrations for Event (ID:999)', () => {

      return roReq({filter: '', orderBy: '', eventID: '999'}, service.GET_REGS_FOR_EVENT)
        .then((res) => {
            const regs = res.data.ResultsOfListOfRegistration.Data.APIRegistration;
            expect(regs).toBe(undefined);
        })
    })            

  })

  describe('POST /GetCustomFields', () => {
    it('should get back all Custom Fields for Event (ID:1111)', () => {

      return roReq({pageSectionID: 1, orderBy: '', eventID: 1111}, service.GET_CUSTOM_FIELDS)
        .then((res) => {
            const fields = res.data.ResultsOfListOfCustomField.Data.APICustomField;
            expect(fields.length).toBe(3)    
        })
    })
    it('should get back one Custom Field for Event (ID:888)', () => {

      return roReq({pageSectionID: 1, orderBy: '', eventID: 888}, service.GET_CUSTOM_FIELDS)
        .then((res) => {
            const fields = res.data.ResultsOfListOfCustomField.Data.APICustomField;
            expect(fields).toBeAn('object');
            expect(fields.EventID).toBe('888');
        })
    })
    it('should get back no Custom Fields for Event (ID:999)', () => {

      return roReq({pageSectionID: 1, orderBy: '', eventID: '999'}, service.GET_CUSTOM_FIELDS)
        .then((res) => {
            const fields = res.data.ResultsOfListOfCustomField.Data.APICustomField;
            expect(fields).toBe(undefined);
        })
    })            

  })

})