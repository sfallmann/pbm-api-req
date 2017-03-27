'use strict';
const {logger, emitter} = require('../config/config');
const MongoClient = require('mongodb').MongoClient;
const dbCon = new MongoClient();
const connection = dbCon.connect(process.env.DB_URI);

/**
 * Query a collection
 * 
 * @param {string} collection - The name of a collection
 * @param {object} query - The object containing query parameters
 * @param {object} project - The project object specifying the fields to return
 */
function queryCollection(collection, query, project) {
  project = project || {};
  return connection
    .then((db) => {
      return db.collection(collection).find(query).project(project);;
    });
}

/**
 * Wraps the cursor.toArray method in a Promise
 * 
 * @param {object} cursor - The db cursor
 */
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

/**
 * UpsertOne document into a collection
 * 
 * @param {object} doc - The document to upsert
 * @param {string} collection - The name of a collection
 * @param {object} options - The options object for the request
 */
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
