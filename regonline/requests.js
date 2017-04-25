'use strict';
const Promise = require('bluebird');
const axios = require('axios');
const qs = require('querystring');
const parseString = require('xml2js').parseString;
const {TOKEN} = require('../config/config.json').REGONLINE;

let HOST;

if (process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'development'){
  HOST = 'http://regonline.getsandbox.com/';
} else {
  HOST = require('../helper/constants.json').REGONLINE.HOST;
}

/**
 * Sends a request to the RegOnline API
 * 
 * @param {object} form - The parameters for the request.
 * @param {string} service - The API endpoint for the request.
 */
const regOnlineSOAP = (form, service) => {
  return	axios({
    method: 'POST',
    url: HOST + service,
    data: qs.stringify(form),
    timeout: 10000,
    headers: {
      'APIToken': TOKEN,
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
};

/**
 * Parses XML into an object
 * 
 * @param {string} res - XML string 
 */
const parseXML = (res) => {
  return new Promise((resolve, reject) => {
    parseString(res.data,
      {explicitArray: false, ignoreAttrs: true},
      (err, result) => {
        if (err) {
          reject(err);
        }
        res.data = result;
        resolve(res);
      });
  });
}

/**
 * Wrapper for the RegOnline API that returns a response object
 * 
 * @param {object} form - The parameters for the request.
 * @param {string} service - The API endpoint for the request.
 */
const regOnlineApiWrapper = (form, service) => {
  return regOnlineSOAP(form, service).then(parseXML);
};

module.exports = regOnlineApiWrapper;
