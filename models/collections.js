const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const collectionSchema = Schema({
  name: String,
  image: String,
  types: {type: Array,
    items: {
      type: String
    }
  },
  abilities: {type: Array,
    items: {
      type: String
    }
  },
  stats: {type: Array,
    items: {
      type: String
    }
  },
  ownerId: String,
});

const Collection = mongoose.model('Collection', collectionSchema);

module.exports = Collection;
