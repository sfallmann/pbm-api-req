const {emitter} = require('../config/config');

function cast(datatype, val){

  if (val === undefined && datatype === 'string'){
    return '';
  } else if (val === undefined) {
    return null;
  };

  switch (datatype){
    case (typeof val):
      return val;
      break;
    case 'number':
      return Number(val);
      break;
    case 'string':
      return String(val);
      break;
    case 'date':
      return new Date(val);
      break;
    case 'boolean':
      return Boolean(val);
    default:
      emitter.emit('error',
        new TypeError(`'${val}' is not type '${datatype}'.`)
      );
  }

}

function isNumber(val){
  return cast('number', val);
}

function isDate(val){
  return cast('date', val);
}

function isString(val){
  return cast('string', val);
}

function isObject(val){
  return cast('object', val);
}

function isFunction(val){
  return cast('function', val);
}

function isBoolean(val){
  return cast('boolean', val);
}

function isSymbol(val){
  return cast('symbol', val);
}

function DataObjectFactory(data, schema) {

  const obj = {};
  
  Object.keys(data).forEach((prop) => {

    if (prop in schema){
      obj[prop] = schema[prop](data[prop]);
    } else {
      obj[prop] = data[prop];
    }
    
  });
  obj['updated_on'] = new Date();
  return obj;

}
function processApiArray(docs, cb){
  const promises = [];
  docs.forEach((doc) => {
    promises.push(cb(doc));
  });
  return Promise.all(promises);
}

function createHubSpotPropObj(doc){

}

function createHubSpotPropOptions(){

}

module.exports = {
  DataObjectFactory,
  processApiArray,
  type: {
    cast,
    isBoolean,
    isDate,
    isFunction,
    isNumber,
    isObject,
    isString,
    isSymbol
  }
};


