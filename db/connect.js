'use strict';
const {logger, emitter} = require('../config/config');
const MongoClient = require('mongodb').MongoClient;
const dbCon = new MongoClient();
const connection = dbCon.connect(process.env.DB_URI);

function queryCollection(collection, query, project) {
  project = project || {};
  return connection
    .then((db) => {
      return db.collection(collection).find(query).project(project);;
    });
}

function toArray(cursor){
  return new Promise((resolve, reject) => {
    cursor.toArray((err, docs) => {
      if (err) {
        reject(err);
      }
      resolve(docs);
    });
  });
};

function upsertOne(doc, collection, options){
  options = options || {upsert: true};
  return connection.then((db) => {
    return db.collection(collection)
      .updateOne({ID: doc.ID}, doc, options)
      .then((result) => {
        return result;
      });
  });
}


module.exports = {
  connection,
  queryCollection,
  toArray,
  upsertOne
};
