'use strict'
const EventEmitter = require('events');

require('./config/config');
const {SERVICE} = require('./helper/constants.json').REGONLINE;
const regOnlineReq = require('./regonline/requests');
const Event = require('./model/event');
const mongoose = require('./db/mongoose');

const reqEmitter = new EventEmitter();

reqEmitter.on('received', (result) => {


	result.forEach((event) => {
		const newEvent = new Event({ 
			ID: event.ID,
			CustomerID: event.CustomerID,
			ParentID: event.ParentID,
			Status: event.Status,
			Title: event.Title,
			StartDate: event.StartDate,
			EndDate: event.EndDate
		});
		
		newEvent.save().then((doc) => {
				result.shift();

				console.log(doc)

				if (result.length < 1){
					reqEmitter.emit('disconnect', 'done');
				}				
		}).catch((err) => {
				console.log(err);
				reqEmitter.emit('disconnect', err);
		});
	})


	
	//console.log(JSON.stringify(result, undefined, 2));
})

reqEmitter.on('disconnect', (msg) => {
	console.log(msg);
	mongoose.disconnect();
})

reqEmitter.on('error', (error) => {
	console.log(error);
})

/* 
regOnlineReq({ filter: '', orderBy: '', eventID: 1887988 }, SERVICE.GET_REGS_BY_EVENTID )
    .then((result) => {
        reqEmitter.emit('received', result);
    })
		.catch((e) => {
			reqEmitter.emit('error', e);
		})

Get All Events 
*/

regOnlineReq({ filter: '', orderBy: ''}, SERVICE.GET_EVENTS )
    .then((result) => {
        reqEmitter.emit('received', result.ResultsOfListOfEvent.Data.APIEvent);
    })
		.catch((e) => {
			reqEmitter.emit('error', e);
		})
