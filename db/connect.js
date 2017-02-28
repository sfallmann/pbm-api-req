'use strict';
require('../config/config');
const MongoClient = require('mongodb').MongoClient;
const dbCon = new MongoClient();


'mongodb://ds157499.mlab.com:57499/pbm-api-dev'
process.env.DB_URI
'mongodb://localhost:27017/pbm-api-dev'

module.exports = {
  'conn': dbCon.connect('mongodb://localhost:27017/pbm-api-dev'),
  getDb
}

function getDb() {
  return dbCon.connect('mongodb://localhost:27017/pbm-api-dev')
    .then((db) => {
      return db;
    }, (err) => {
      throw err;
    });
}


