const Party = require('../models/party.model.js');
const { cloudinary } = require('../utils/cloudinary');

exports.getAllParties = async (req, res) => {
  try {
    const response = await Party.find();
    res.json(response);
    res.status(200);
  } catch (e) {
    console.log(e);
    res.status(500);
  }
};

exports.addParty = async (req, res) => {
  const { artists, venue, genre, date, lat, lng, iconURL, instagram, userId, partyImage } = req.body;

  Party.create({ artists, venue, date, genre, lat, lng, iconURL, instagram, userId, partyImage },
    (error, newParty) => {
      if (error) {
        console.log(error);
        res.sendStatus(500);
      }
      else {
        res.json(newParty);
        res.status(200);
      }
    });
};

exports.deleteParty = async (req, res) => {
  await Party.findByIdAndDelete((req.params.id))
    .then(() => res.json('Party deleted'))
    .catch(err => res.status(400).json('Error!!:', err));
};

exports.goingToParty = async (req, res) => {
  Party.findById(req.params.id)
    .then(party => {
      party.score++;
      party.save()
        .then(() => res.json(party))
        .catch(err => res.status(400).json('Error: ' + err));
    })
    .catch(err => res.status(400).json('Error: ' + err));
}

exports.maybeGoingToParty = async (req, res) => {
  Party.findById(req.params.id)
    .then(party => {
      party.score = party.score + .3;
      party.save()
        .then(() => res.json(party))
        .catch(err => res.status(400).json('Error: ' + err));
    })
    .catch(err => res.status(400).json('Error: ' + err));
}

exports.notGoingToParty = async (req, res) => {
  Party.findById(req.params.id)
    .then(party => {
      party.score--;
      party.save()
        .then(() => res.json(party))
        .catch(err => res.status(400).json('Error: ' + err));
    })
    .catch(err => res.status(400).json('Error: ' + err));
}

exports.getUsersParties = async (req, res) => {
  try {
    const response = await Party.find({ userId: req.params.userId });
    res.json(response);
    res.status(200);
  } catch (e) {
    console.log(e);
    res.status(500);
  }
}

exports.uploadToCloudinary = async (req, res) => {
  try {
    const fileStr = req.body.data;
    const uploadResponse = await cloudinary.uploader.upload(fileStr, {
      upload_preset: 'dev_setups',
    });
    console.log(uploadResponse.public_id);
    res.json(
      uploadResponse.url,
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ err: 'Something went wrong' });
  }
}



