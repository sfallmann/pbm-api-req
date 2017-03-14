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

  const data = qs.stringify(request.data) || null;
  const params = request.params || null;
  const headers = request.headers || null;

  return	axios({
    method: request.method,
    url: request.url,
    baseURL: HOST,
    data,
    timeout: 10000,
    headers,
    params
  });
}

function hubspotApi() {

  const getToken = () => {
    const req = {
      baseURL: HOST,
      method: 'POST',
      url: '/oauth/v1/token',
      data: {
        refresh_token: HUBSPOT.REFRESH_TOKEN,
        grant_type: 'refresh_token',
        client_id: HUBSPOT.ID,
        client_secret: HUBSPOT.SECRET
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }
    return apiRequest(req);
  };

  const getContactByEmail = (email) => {
    getToken()
    .then((res) => {
      const req = {
        baseURL: HOST,
        method: 'POST',
        url: `/contacts/v1/contact/email/${email}/profile?properties=vid&properties=email`,
        headers: {
          'Authorization': `Bearer ${res.data.access_token}`
        }
      }
      return apiRequest(req);
    })

  }  
  
  return {
    getToken,
    getContactByEmail
  }
}




hubspotApi().getContactByEmail('jfields@pbmbrands.com')
  .then((res) => {
    console.log(JSON.stringify(res.data, null, 2));
  })
  .catch(console.log);
