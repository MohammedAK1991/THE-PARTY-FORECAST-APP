const mongoose = require('./index.js');

const Schema = mongoose.Schema;

const partySchema = new Schema({
  artists: {
    type: String,
    required: false,
    unique: false,
  },
  venue: {
    type: String,
    required: false,
  },
  date: {
    type: Date,
    default: Date.now(),
    required: false,
  },
  genre: {
    type: String,
    required: false,
  },
  lat: {
    type: Number,
    required: false,
  },
  lng: {
    type: Number,
    required: false,
  },
  iconURL: {
    type: String,
    required: false,
  },
  instagram: {
    type: String,
    required: false,
  },
  score: {
    type: Number, default: 0, required: false
  },
  userId: {
    type: Number,
    default: 0
  },
  partyImage: {
    type: String,
    required: false
  }
});

const Party = mongoose.model('Party', partySchema);

module.exports = Party;