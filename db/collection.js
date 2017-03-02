const {ObjectID} = require('mongodb');
const {connection,queryCollection,toArray,upsertOne}
  = require('./connect');

class Collection{

  constructor(name) {
    this.name = name;
  }

  find(doc, project) {

    doc = doc || {};
    project = project || {};

    const cursor = connection
                    .then((db) => {
                      return db.collection(this.name).find(doc, project);
                    });

    const obj = {
      cursor: Promise.resolve(cursor),
      toArray:  () => {
        return obj.cursor.then(toArray);
      },
      project: (doc) => {
        obj.cursor = obj.cursor.then(project);
        return obj;
      },
      count:  () => {
        return obj.cursor.then(count);
      },
      explain: () => {
        return obj.cursor.then(explain);
      }

    }
    return obj;
  }


  drop(options) {
    options = options || {};
    return connection
      .then((db) => {
        return db.collection(this.name).drop(options);
      });
  }

  createIndex(spec, options) {
    options = options || {};
    return connection
      .then((db) => {
        return db.collection(this.name).createIndex(spec, options);
      });
  }

  insertMany(docs, options) {
    options = options || {};
    return connection
      .then((db) => {
        return db.collection(this.name).insertMany(docs, options);
      });
  }

  updateOne(filter, doc, options){
    options = options || {};
    return connection
      .then((db) => {
        return db.collection(this.name).updateOne(filter, doc, options);
      });
  }
}

function project(results) {
  return results.project(doc);
}

function count(results) {
  return results.count();
}

function explain(results) {
  return results.explain();
};

module.exports = {
  Collection
};

