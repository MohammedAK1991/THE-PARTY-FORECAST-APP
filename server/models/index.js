const mongoose = require('mongoose');
require('dotenv').config();

const uri = process.env.MONGODB_URI //|| 'mongodb://localhost/party_ForecastDemo2';

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });

const connection = mongoose.connection;

connection.once('open', () => {
  console.log('successfully connected mongodb');
});

module.exports = mongoose;