const type = require('../../helper/utils').type;

const EventSchema = {
  ID: type.isNumber,
  CustomerID: type.isNumber,
  Status: type.isString,
  Title: type.isString,
  StartDate: type.isDate,
  EndDate: type.isDate,
  ActiveDate: type.isDate,
  AddDate: type.isDate,
  ModDate: type.isDate,
  City: type.isString,
  State: type.isString,
  Country: type.isString,
  CountryCode: type.isString,
  PostalCode: type.isString,
  LocationName: type.isString,
  LocationRoom: type.isString,
  LocationPhone: type.isString,
  LocationBuilding: type.isString,
  LocationAddress1: type.isString,
  LocationAddress2: type.isString,
  TimeZone: type.isString,
  IsActive: type.isBoolean
};

module.exports = EventSchema;
