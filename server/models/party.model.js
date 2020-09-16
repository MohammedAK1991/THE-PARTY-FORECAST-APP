const mongoose = require('./index.js');
const Schema = mongoose.Schema;

const partySchema = new Schema({
  artists: {
    type: String,
  },
  venue: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
  genre: {
    type: String,
  },
  lat: {
    type: Number,
  },
  lng: {
    type: Number,
  },
  iconURL: {
    type: String,
  },
  instagram: {
    type: String,
  },
  score: {
    type: Number,
    default: 0
  },
  userId: {
    type: Number,
    default: 0
  },
  partyImage: {
    type: String,
  },
  userId: {
    type: Number,
  }
});

const Party = mongoose.model('Party', partySchema);

module.exports = Party;