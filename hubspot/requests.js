'use strict';
const axios = require('axios');
const qs = require('querystring');
const {HUBSPOT} = require('../config/config.json');

let {HOST} = require('../helper/constants.json').HUBSPOT;

//if (process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'development'){
//  HOST = 'http://regonline.getsandbox.com/';
//} else {
//  HOST = require('../helper/constants.json').REGONLINE.HOST;
//}

//  request object
// {
//    host,
//    path,
//    data,
//    paramStr,
//    headers
//  }
//

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

const hubspotApi = {
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
    return hubspotApi.getToken()
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
  getContactProperty: (options) => {
    return hubspotApi.getToken()
      .then((res) => {
        const req = {
          baseURL: HOST,
          method: 'GET',
          url: `/properties/v1/contacts/properties/named/${name}`,
          headers: {
            'Authorization': `Bearer ${res.data.access_token}`
          },
          params: {
            showListMemberships: false,
            formSubmissionMode: 'none',
            property: 'associated_reps',
            propertyMode: 'value_only'
          },            
        }

        return apiRequest(req);
      })

  },
  createContactProperty: (data) => {

    return hubspotApi.getToken()
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

    return hubspotApi.getToken()
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
    return hubspotApi.getToken()
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


    return hubspotApi.getToken()
      .then((res) => {
        const req = {
          baseURL: HOST,
          method: 'POST',
          url: `https://api.hubapi.com/contacts/v1/contact/createOrUpdate/email/${email}`,
          headers: {
            'Authorization': `Bearer ${res.data.access_token}`,
            'Content-Type': 'application/json'
          },
          data
        }

        return apiRequest(req);
      });
  }      
}





/*

// create property example
const data = {
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

*/  