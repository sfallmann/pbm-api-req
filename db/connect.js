'use strict';
require('../config/config');
const MongoClient = require('mongodb').MongoClient;
const dbCon = new MongoClient();

function DbWrapper(uri, options) {

  this.connection = this.connection || dbCon.connect(uri, options);
}

module.exports = dbCon.connect(process.env.DB_URI);