const Promise = require('bluebird');
const {ObjectID} = require('mongodb');
const {connection,queryCollection,upsertOne}
  = require('./connect');


/**
 * Collection class for simplify working with MongoDB collections
 */
class Collection{

  constructor(name) {
    this.name = name;
  }

  aggregate(pipeline, options) {

    pipeline = pipeline || {};
    options = options || {};

    const cursor = connection
                    .then((db) => {
                      return db.collection(this.name).aggregate(pipeline, options);
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


  /** Query the collection for a document
   * 
   * @param {object} doc - The document to match
   * @param {object} project - Specify which fields you want 
   */
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

  /**
   * Drop the collection from the db
   * 
   * @param {object} options - The options object
   */
  drop(options) {
    options = options || {};
    return connection
      .then((db) => {
        return db.collection(this.name).drop(options);
      });
  }

  /**
   * Create an index for the collection
   * 
   * @param {object} spec - The specifications for the index
   * @param {object} options - The options object
   */
  createIndex(spec, options) {
    options = options || {};
    return connection
      .then((db) => {
        return db.collection(this.name).createIndex(spec, options);
      });
  }

  distinct(key, query, options) {
    query = query || {};
    options = options || {};
    return connection
      .then((db) => {
        return db.collection(this.name).distinct(key, query, options);
      });
  }

  /**
   * Insert multiple documents to the collection
   * 
   * @param {arry} docs - Array of documents(objects) to insert
   * @param {object} options - The options object
   */
  insertMany(docs, options) {
    options = options || {};
    return connection
      .then((db) => {
        return db.collection(this.name).insertMany(docs, options);
      });
  }

  /**
   * Update a single document as specified by the filter in the collection
   * 
   * @param {object} filter - The criteria for selecting the document to update
   * @param {object} doc - The data to update the document
   * @param {object} options - The options object
   */
  updateOne(filter, doc, options){
    
    options = options || {};
    return connection
      .then((db) => {
        return db.collection(this.name).updateOne(filter, doc, options);
      });
  }

   updateMany(filter, doc, options){
    
    options = options || {};
    return connection
      .then((db) => {
        return db.collection(this.name).updateMany(filter, doc, options);
      });
  } 

  findOneAndUpdate(filter, doc, options){
    options = options || {};
    return connection
      .then((db) => {
        return db.collection(this.name).findOneAndUpdate(filter, doc, options);
      });
  }

  insert(doc, options){
    options = options || {};
    return connection
      .then((db) => {
        return db.collection(this.name).insert(doc, options);
      });
  }  
  
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
 * Additional method added to the Collection.find method
 * 
 * @param {object} results - The results of the find request
 */
function project(results) {
  return results.project(doc);
}

/**
 * Additional method added to the Collection.find method
 * 
 * @param {object} results - The results of the find request
 */
function count(results) {
  return results.count();
}

/**
 * Additional method added to the Collection.find method
 * 
 * @param {object} results - The results of the find request
 */
function explain(results) {
  return results.explain();
};

module.exports = {
  Collection
};

