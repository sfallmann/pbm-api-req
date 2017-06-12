'use strict';
const Promise = require('bluebird');
const {emitter} = require('../config/config');
const {logger} = require('../logger');
const MongoClient = require('mongodb').MongoClient;
const dbCon = new MongoClient();
//const connection = dbCon.connect(process.env.DB_URI);
const connection = dbCon.connect(process.env.DB_URI)


const closeDB = () => {
  connection
    .then((db) => {
      return db.close();
    })
    .then(() => {
      logger.info('db closed by application');
      process.exit();
    })
    .catch((err) => {
      logger.error(err);
      process.exit();
    });
}

if (process.platform === "win32") {
  require("readline")
    .createInterface({
      input: process.stdin,
      output: process.stdout
    })
    .on("SIGINT", function () {
      process.emit("SIGINT");
    });

}
process.on("unhandledException", closeDB);
process.on("exit", closeDB);
process.on("SIGINT", closeDB);

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
  upsertOne
};
