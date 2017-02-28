'use strict';
require('../config/config');
const MongoClient = require('mongodb').MongoClient;
const dbCon = new MongoClient();
const connection = dbCon.connect('mongodb://localhost:27017/pbm-api-dev');

'mongodb://ds157499.mlab.com:57499/pbm-api-dev'
process.env.DB_URI
'mongodb://localhost:27017/pbm-api-dev'

function getDb() {
  return connection
    .then((db) => {
      return db;
    }, (err) => {
      throw err;
    });
}

function getCollection(name, query){
  return connection
    .then((db) => {
      return db.collection(name).find(query);
    })
}

function iterateCollection(cursor){
  return new Promise((resolve, reject) => {
    cursor.toArray((err, docs) => {
      if (err) {
        reject(err);
      }
      resolve(docs);
    });
  });
};

module.exports = {
  'conn': dbCon.connect('mongodb://localhost:27017/pbm-api-dev'),
  getDb,
  getCollection,
  iterateCollection
}


