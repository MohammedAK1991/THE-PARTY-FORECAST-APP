const Party = require('../models/party.model.js');

exports.getAllParties = async (req,res) => {
  try {
    const response = await Party.find();
    res.json(response);
    res.status(200);
  } catch (e) {
    console.log(e);
    res.status(500);
  }
};

exports.addParty = async (req,res) => {

  const {title,venue, date} = req.body;

  await Party.create ({title,venue,date},
    (error,newParty) => {
      if (error) {
        console.log(error);
        res.sendStatus(500);
      }
      else {
        console.log('Party created', newParty);
        res.json(newParty);
        res.status(200);
      }
    });
};

exports.deleteParty = async (req,res) => {
  await Party.findByIdAndDelete((req.params.id))
    .then(() => res.json('Party deleted'))
    .catch(err => res.status(400).json('Error!!:',err));
};



