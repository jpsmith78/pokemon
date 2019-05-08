const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const collectionSchema = Schema({
  name: String,
  image: String,
  abilities: String,
  stats: String
});

const Collection = mongoose.model('Collection', collectionSchema);

module.exports = Collection;
