const expect = require('expect');
const nock = require('nock');
const responses = require('../mock/hubspot/responses.json');

const {HubSpotAPI} = require('./requests');

const createPropData = {
  name: 'add_property_test',
  label: 'Add Property Test',
  groupName: 'conferences',
  type: 'enumeration',
  fieldType: 'checkbox',
  description: 'testing api creation of contact property',  
  options: [
    {
      value: '1',
      label: 'one'
    },
    { 
      value: '2',
      label: 'two'
    },
    {
      value: 'test_change',
      label: 'Added New Value - Removed Old'
    },
    {
      value: 3,
      label: '03',
    },
    {
      value: 'bananas',
      label: 'Bananas!!!'
    }
  ],
  formField: 'true'
}

const updatePropData = {};
Object.assign(updatePropData, createPropData);
delete updatePropData.name;

const createContactData = {properties: [{property: "firstname", value: "John"}]}

describe('Hubspot', () => {

  beforeEach(() => {

    nock('https://api.hubapi.com')
    .matchHeader("content-type", "application/x-www-form-urlencoded")
    .post('/oauth/v1/token')
    .reply(200, function(uri, requestBody) {
      return responses.getToken_success
    });

    nock('https://api.hubapi.com')
    .matchHeader("authorization", "Bearer mock_access_token")
    .get('/contacts/v1/contact/email/jfields@pbmbrands.com/profile?' +
      'showListMemberships=false&formSubmissionMode=none&' +
      'property=associated_reps&propertyMode=value_only')
    .reply(200, function(uri, requestBody) {

      return responses.getContactByEmail_success;
    });

    nock('https://api.hubapi.com')
    .matchHeader("authorization", "Bearer mock_access_token")
    .get('/properties/v1/contacts/properties/named/firstname')
    .reply(200, function(uri, requestBody) {
      return responses.getContactProperty_success;
    });

    nock('https://api.hubapi.com')
    .matchHeader("authorization", "Bearer mock_access_token")
    .matchHeader("content-type", "application/json")
    .post('/properties/v1/contacts/properties', createPropData)
    .reply(200, function(uri, requestBody) {
      return responses.createContactProperty_success;
    });   

    nock('https://api.hubapi.com')
    .matchHeader("authorization", "Bearer mock_access_token")
    .matchHeader("content-type", "application/json")
    .put('/properties/v1/contacts/properties/named/add_property_test', updatePropData)
    .reply(200, function(uri, requestBody) {
      return responses.createContactProperty_success;
    });

    nock('https://api.hubapi.com')
    .matchHeader("authorization", "Bearer mock_access_token")
    .matchHeader("content-type", "application/json")
    .post('/contacts/v1/contact/createOrUpdate/email/jfields@pbmbrands.com', createContactData)
    .reply(200, function(uri, requestBody) {
      return responses.createOrUpdateContact_success;
    });        

  })

  it('should get an access_token', () => {
    return HubSpotAPI.getToken()
      .then((res) => {
        const token = res.data.access_token;
        expect(token).toExist();
      });
  });

  it('should return a contact profile ("jfields@pbmbrands.com")', () => {
    return HubSpotAPI.getContactByEmail('jfields@pbmbrands.com')
      .then((res) => {
        const data = res.data;
        const vid = data.vid;
        const email = data['identity-profiles'][0].identities[0].value;
        expect(vid).toExist();
        expect(email).toBe('jfields@pbmbrands.com');
      });
  });

  it('should return property info ("firstname")', () => {
    return HubSpotAPI.getContactProperty('firstname')
      .then((res) => {
        const name = res.data.name;
        expect(name).toBe('firstname');
      });
  });

  it('should create a contact property ("add_property_test")', () => {
    return HubSpotAPI.createContactProperty(createPropData)
      .then((res) => {
        const name = res.data.name;
        expect(name).toBe('add_property_test');
      });
  }); 

  it('should update a contact property ("add_property_test")', () => {
    return HubSpotAPI.updateContactProperty("add_property_test", updatePropData)
      .then((res) => {
        const name = res.data.name;
        expect(name).toBe('add_property_test');
      });
  });

  it('should update or create a contact ("jfields@pbmbrands.com")', () => {
    return HubSpotAPI.createOrUpdateContact(
      "jfields@pbmbrands.com", createContactData)
      .then((res) => {
        const vid = res.data.vid;
        expect(vid).toBe(6277251);
      });
  });               

})
