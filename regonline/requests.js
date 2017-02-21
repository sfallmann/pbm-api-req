'use strict'
const axios = require('axios');
const qs = require('querystring');
const parseString = require('xml2js').parseString;

const {HOST} = require('../helper/constants.json').REGONLINE;
const {TOKEN} = require('../config/config.json').REGONLINE;

const regOnlineSOAP = (form, service) => {
	return	axios({
		method: 'POST',
		url: HOST + service,
		data: qs.stringify(form),
        timeout: 6000,
		headers: {
			'APIToken': TOKEN,
			'Content-Type': 'application/x-www-form-urlencoded'
		}
	});
}

const parseXML = (xml) => {
	return new Promise((resolve, reject) => {
		parseString(xml.data,  { explicitArray : false, ignoreAttrs : true }, (err, result) => {

			if (err){
				reject(err)
			}
			resolve(result);
		});
	}) 
}

const regOnlineApiWrapper = function(form, service){

   return regOnlineSOAP(form, service)
        .then(parseXML);

} 

module.exports = regOnlineApiWrapper;