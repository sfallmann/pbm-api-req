'use strict';
const {logger, emitter} = require('../config/config');
const MongoClient = require('mongodb').MongoClient;
const dbCon = new MongoClient();
const connection = dbCon.connect('mongodb://localhost:27017/pbm-api-dev');

function getCollection(name, query, project) {
  project = project || {};
  return connection
    .then((db) => {
      return db.collection(name).find(query).project(project);;
    });
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

function upsertOne(doc, collection){
  return connection.then((db) => {
    return db.collection(collection)
      .updateOne({ID: doc.ID}, doc, {upsert: true})
      .then((result) => {
        return result;
      });
  });
}

process.on('uncaughtException', (err) => {
  logger.log('There was an uncaught error', err);

  conn.then((db) => {
    db.close();
    process.exit(1);
  });
});

module.exports = {
  'conn': connection,
  getCollection,
  iterateCollection,
  upsertOne
};
