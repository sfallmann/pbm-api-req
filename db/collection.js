const {ObjectID} = require('mongodb');
const {connection,queryCollection,toArray,upsertOne}
  = require('./connect');

class Collection{

  constructor(name){
    this.name = name;
  }

  collection(){
    return connection
      .then((db) => {
        return db.collection(this.name);
      });
  }

  find(query, project) {

    query = query || {};
    project = project || {};

    const cursor = this.collection()
                    .then((collection) => {
                      return collection.find(query, project);
                    })
    const obj = {
      cursor: Promise.resolve(cursor),
      toArray:  () => {
        return cursor.then(toArray);
      },
      project: (doc) => {
        obj.cursor = obj.cursor.then((cursor) => {
         return cursor.project(doc);
        });
        return obj;
      },
      count:  () => {
        return obj.cursor.then((cursor) => {
         return cursor.count();
        });
      },
      explain: () => {
        return obj.cursor.then((cursor) => {
         return cursor.explain();
        });
      }

    }
    return obj;
  }

  drop(options) {

    options = options || {};
    return this.collection()
      .then((collection) => {
        return collection.drop(options);
      });
  }
  createIndex(spec, options){
    if (typeof spec != 'object'){
      throw new TypeError('"createIndex" spec must be an object');
    }
    options = options || {};
    return this.collection()
      .then((collection) => {
        return collection.createIndex(spec, options);
      })
  }

}

