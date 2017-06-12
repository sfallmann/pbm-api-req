const {emitter} = require('../config/config');

/**
 * Casts the value into the type specifed in datatype
 * 
 * @param {string} datatype - The type to cast the value
 * @param {*} val - the value that needs conversion
 */
function cast(datatype, val){

  if (val === undefined && datatype === 'string'){
    return '';
  } else if (val === undefined) {
    return null;
  };

  switch (datatype){
    case (typeof val):
      return val;
    case 'number':
      return Number(val);
    case 'string':
      return String(val);
    case 'date':
      return new Date(val);
    case 'boolean':
      return Boolean(val);
    default:
      emitter.emit('error',
        new TypeError(`'${val}' is not type '${datatype}'.`)
      );
  }

}

/**
 * Takes a value and calls cast specifiying Number datatype
 * 
 * @param {*} val - value needing conversion\validating
 */
function isNumber(val){
  return cast('number', val);
}

/**
 * Takes a value and calls cast for validation or conversion to Date
 * An error will thrown upon casting failure
 * 
 * @param {*} val - value needing conversion\validating
 */
function isDate(val){
  return cast('date', val);
}

/**
 * Takes a value and calls cast for validation or conversion to String
 * An error will thrown upon casting failure
 * 
 * @param {*} val - value needing conversion\validating
 */
function isString(val){
  return cast('string', val);
}

/**
 * Takes a value and calls cast for validation or conversion to Object
 * An error will thrown upon casting failure
 * 
 * @param {*} val - value needing conversion\validating
 */
function isObject(val){
  return cast('object', val);
}

/**
 * Sends over for validation - will not be casted
 * 
 * @param {*} val - value needing conversion\validating
 */
function isFunction(val){
  return cast('function', val);
}

/**
 * Takes a value and calls cast for validation or conversion to Boolean
 * An error will thrown upon casting failure
 * 
 * @param {*} val - value needing conversion\validating
 */
function isBoolean(val){
  return cast('boolean', val);
}
/**
 * Takes a value and calls cast for validation or conversion to Symbol
 * An error will thrown upon casting failure
 * 
 * @param {*} val - value needing conversion\validating
 */
function isSymbol(val){
  return cast('symbol', val);
}

/**
 * Parses a data object according to a schema for validation\conversion
 * 
 * @param {object} data - The object to be parsed
 * @param {*} schema - The schema to validate\convert against
 */
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

function chunk(arr, chunkSize) {
  var r = [];
  for (var i=0,len=arr.length; i<len; i+=chunkSize)
    r.push(arr.slice(i,i+chunkSize));
  return r;
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
  },
  chunk
};


