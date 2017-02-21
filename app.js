const {SERVICE} = require('./helper/constants.json').REGONLINE;
const regOnlineReq = require('./regonline/requests');
const EventEmitter = require('events');

const reqEmitter = new EventEmitter();

reqEmitter.on('received', (result) => {

	console.log(JSON.stringify(result, undefined, 2));
})

reqEmitter.on('error', (error) => {
	console.log(error);
})


regOnlineReq({ filter: '', orderBy: '', eventID: 1887988 }, SERVICE.GET_REGS_BY_EVENTID )
    .then((result) => {
        reqEmitter.emit('received', result);
    })
		.catch((e) => {
			reqEmitter.emit('error', e);
		})

/* Get All Events 
regOnlineReq({ filter: '', orderBy: ''}, SERVICE.GET_EVENTS )
    .then((result) => {
        reqEmitter.emit('received', result.ResultsOfListOfEvent.Data.APIEvent);
    })
		.catch((e) => {
			reqEmitter.emit('error', e);
		})
*/