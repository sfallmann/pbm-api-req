const Events = require('./events/dao');
const Fields = require('./fields/dao');
const Regs = require('./regs/dao');

const RegOnline = () => {
  return Object.assign({}, Events, Fields, Regs);
}

module.exports = {RegOnline};