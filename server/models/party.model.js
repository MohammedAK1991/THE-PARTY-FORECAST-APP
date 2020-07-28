const mongoose = require('./index.js');

const Schema = mongoose.Schema;

const partySchema = new Schema({
  title: {
    type:String,
    required:true,
    unique:true,
  },
  venue: {
    type:String,
    required:true,
  },
  date: {
    type:Date,
    default: Date.now(),
    required:false,
  }
});

const Party = mongoose.model('Party',partySchema);

module.exports = Party;