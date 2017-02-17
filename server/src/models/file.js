const GridFs = require('mongoose-gridfs');
const Promise = require('bluebird');

exports = module.exports = (db) => {
  db.fs = GridFs().model;
  Promise.promisifyAll(db.fs);
};
