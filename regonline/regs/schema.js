const type = require('../../helper/utils').type;

/**
 * Schema object for RegOnline Registrations
 */
const RegSchema = {
  ID: type.isNumber,
  EventID: type.isNumber,
  GroupID: type.isNumber,
  RegTypeID: type.isNumber,
  RegistrationType: type.isString,
  FirstName: type.isString,
  LastName: type.isString,  
  Title: type.isString,
  Email: type.isString,
  Address1: type.isString,
  Address2: type.isString,
  City: type.isString,
  State: type.isString,
  PostalCode: type.isString,  
  BalanceDue: type.isNumber,
  Phone: type.isString,
  Extension: type.isString,
  Fax: type.isString,
  BadgeName: type.isString,
  RoomSharerID: type.isNumber,
  IsSubstitute: type.isBoolean,
  AddBy: type.isString,
  AddDate: type.isDate,
  ModBy: type.isString,
  ModDate: type.isDate,
};

module.exports = RegSchema;
