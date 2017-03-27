const type = require('../../helper/utils').type;

/**
 * Schema object for RegOnline CustomFields
 */
const FieldSchema = {
  ID: type.isNumber,
  EventID: type.isNumber,
  PageSectionID: type.isNumber,
  NameOnForm: type.isString,
  NameOnReport: type.isString
};

module.exports = FieldSchema;
