'use strict'
require('./config/config');
const {SERVICE} = require('./helper/constants.json').REGONLINE;
const regOnlineReq = require('./regonline/requests');
const Event = require('./model/event');

function regOnlineDO(){

  const data = {
  }

  const actions = {
    GetEvents: function(callback){

      if (data.events !== undefined){
        callback(null, data.events);
      } else {
        regOnlineReq({ filter: '', orderBy: ''}, SERVICE.GET_EVENTS )
          .then((result) => {
            data.events = result.ResultsOfListOfEvent.Data.APIEvent;
            callback(null, data.events);
          })
          .catch((e) => {
            callback(e);
          })
      }

    }
  }

  return {
    actions
  }
}

const regO = regOnlineDO();
regO.actions.GetEvents((err, result) => {
  console.log(result);
});


/*
regOnlineReq({ filter: '', orderBy: ''}, SERVICE.GET_EVENTS )
  .then((result) => {
      reqEmitter.emit('eventsReceived', result.ResultsOfListOfEvent.Data.APIEvent);
  })
  .catch((e) => {
    reqEmitter.emit('error', e);
  })


reqEmitter.on('eventsReceived', (result) => {

  const saveEvents = result.map((event) => {
    const newEvent = new Event({ 
    ID: event.ID,
    CustomerID: event.CustomerID,
    ParentID: event.ParentID,
    Status: event.Status,
    Title: event.Title,
    StartDate: event.StartDate,
    EndDate: event.EndDate
  });
  
  return newEvent.save();
})

  Promise.all(saveEvents).then(values => { 
        console.log(values);
        reqEmitter.emit('disconnect', 'done');
      }).catch(reason => { 
        console.log(reason)
      });
})

reqEmitter.on('disconnect', (msg) => {
	console.log(msg);
	mongoose.disconnect();
})

reqEmitter.on('error', (error) => {
	console.log(error);
})


*/