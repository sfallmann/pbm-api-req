'use strict';
const axios = require('axios');
const qs = require('querystring');
const {HUBSPOT} = require('../config/config.json');

let {HOST} = require('../helper/constants.json').HUBSPOT;

/**
 * Base function for making HubSpot API calls
 * @param {object} request 
 */
const apiRequest = (request) => {

  const req = {
    method: request.method,
    url: request.url,
    baseURL: HOST,
    timeout: 10000,
  }
  
  if (request.data) {
    req.data = request.data;
  }

  if (request.params) {
    req.params = request.params;
  }

  if (request.headers) {
    req.headers = request.headers;
  }

  return	axios(req);
}

/**
 * "Module" containing all needed HubSpot API requests
 */
const HubSpotAPI = {
  getToken: () => {

    const data = qs.stringify({
        refresh_token: HUBSPOT.REFRESH_TOKEN,
        grant_type: 'refresh_token',
        client_id: HUBSPOT.ID,
        client_secret: HUBSPOT.SECRET
      });

    const req = {
      baseURL: HOST,
      method: 'POST',
      url: '/oauth/v1/token',
      data,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }

    return apiRequest(req);
  },
  getContactByEmail: (email) => {
    return HubSpotAPI.getToken()
      .then((res) => {
        const req = {
          baseURL: HOST,
          method: 'GET',
          url: `/contacts/v1/contact/email/${email}/profile`,
          params: {
            showListMemberships: false,
            formSubmissionMode: 'none',
            property: 'associated_reps',
            propertyMode: 'value_only'
          },
          headers: {
            'Authorization': `Bearer ${res.data.access_token}`
          }
        }

        return apiRequest(req);
      });
  },
  getAllContactProperties: () => {
    return HubSpotAPI.getToken()
      .then((res) => {
        const req = {
          baseURL: HOST,
          method: 'GET',
          url: `/properties/v1/contacts/properties`,
          headers: {
            'Authorization': `Bearer ${res.data.access_token}`
          }        
        }

        return apiRequest(req);
      })

  },
  getContactProperty: (name) => {
    return HubSpotAPI.getToken()
      .then((res) => {
        const req = {
          baseURL: HOST,
          method: 'GET',
          url: `/properties/v1/contacts/properties/named/${name}`,
          headers: {
            'Authorization': `Bearer ${res.data.access_token}`
          }        
        }

        return apiRequest(req);
      })

  },
  createContactProperty: (data) => {
    return HubSpotAPI.getToken()
      .then((res) => {
        const req = {
          baseURL: HOST,
          method: 'POST',
          url: '/properties/v1/contacts/properties',
          headers: {
            'Authorization': `Bearer ${res.data.access_token}`,
            'Content-Type': 'application/json'
          },
          data
        }

        return apiRequest(req);
      });
  },
  updateContactProperty: (name, data) => {
    return HubSpotAPI.getToken()
      .then((res) => {
        const req = {
          baseURL: HOST,
          method: 'PUT',
          url: `/properties/v1/contacts/properties/named/${name}`,
          headers: {
            'Authorization': `Bearer ${res.data.access_token}`,
            'Content-Type': 'application/json'
          },
          data
        }

        return apiRequest(req);
      });
  },  
  getContactPropertyGroups: () => {
    return HubSpotAPI.getToken()
      .then((res) => {
        const req = {
          baseURL: HOST,
          method: 'GET',
          url: `/properties/v1/contacts/groups`,
          headers: {
            'Authorization': `Bearer ${res.data.access_token}`
          }
        }

        return apiRequest(req);
      })
  },
  createOrUpdateContact: (email, data) => {
    return HubSpotAPI.getToken()
      .then((res) => {
        const req = {
          baseURL: HOST,
          method: 'POST',
          url: `/contacts/v1/contact/createOrUpdate/email/${email}`,
          headers: {
            'Authorization': `Bearer ${res.data.access_token}`,
            'Content-Type': 'application/json'
          },
          data
        }

        return apiRequest(req);
      });
  },
  formatResponse: (results) => {

    const obj = Object.assign(Object.create(null), { 
      status: undefined,
      msg: undefined,
    });

    if (results instanceof Error) {
      obj.error = results.message;
      obj.status = results.response.status;
      obj.msg = results.response.data.message;
    } else {
      obj.status = results.status;
      obj.msg = results.statusText
      obj.data = results.data
    }

    return obj;

  }        
}

module.exports = {HubSpotAPI};

/*
EXAMPLES 

HubSpotAPI.createOrUpdateContact("jfields@pbmbrands.com", {properties: [{property: "firstname", value: "John"}]})
  .then((res) => {
    console.log(JSON.stringify(res.data, null, 2));
  })
  .catch(console.log);
HubSpotAPI.createContactProperty(data)
  .then((res) => {
    console.log(JSON.stringify(res.data, null, 2));
  })
  .catch(console.log);

const data = {
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


HubSpotAPI.getContactProperty('firstname')
  .then((res) => {
    console.log(JSON.stringify(res.data, null, 2));
  })
  .catch(console.log);
// create property example


*/  