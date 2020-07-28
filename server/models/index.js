const mongoose = require('mongoose');

const uri = 'mongodb://localhost/party_Forecast';

mongoose.connect(uri, { useNewUrlParser:true, useUnifiedTopology:true, useCreateIndex:true });

const connection = mongoose.connection;

connection.once('open', () => {
  console.log('successfully connected mongodb');
});

module.exports = mongoose;