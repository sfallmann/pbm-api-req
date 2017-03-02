'use strict';
const axios = require('axios');
const qs = require('querystring');
const parseString = require('xml2js').parseString;
const {TOKEN} = require('../config/config.json').REGONLINE;

let HOST;

if (process.env.NODE_ENV = 'test'){
  HOST = 'http://regonline.getsandbox.com/';
} else {
  HOST = require('../helper/constants.json').REGONLINE.HOST;
}

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

const parseXML = (xml) => {
  return new Promise((resolve, reject) => {
    parseString(xml.data,
      {explicitArray: false, ignoreAttrs: true},
      (err, result) => {
        if (err) {
          reject(err);
        }
        resolve(result);
      });
  });
}

const regOnlineApiWrapper = function(form, service){
  return regOnlineSOAP(form, service).then(parseXML);
};

module.exports = regOnlineApiWrapper;
