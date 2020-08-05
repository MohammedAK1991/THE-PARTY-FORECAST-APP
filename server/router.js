const { cloudinary } = require('./utils/cloudinary');
const express = require('express');
const router = express.Router();

const controllers = require('./controllers/party.controller.js');

//get all events
router.get('/parties', controllers.getAllParties);

//add events
router.post('/parties', controllers.addParty);

//added delete route to clean up database
router.delete('/parties/:id', controllers.deleteParty);

router.post('/parties/:id/going', controllers.goingToParty);

router.post('/parties/:id/maybe', controllers.maybeGoingToParty);

router.post('/parties/:id/not', controllers.notGoingToParty);

//cloudinary


router.post('/api/upload', async (req, res) => {
  try {
      const fileStr = req.body.data;
      const uploadResponse = await cloudinary.uploader.upload(fileStr, {
          upload_preset: 'dev_setups',
      });
      console.log(uploadResponse.public_id);
      console.log(uploadResponse);

      res.json(
        uploadResponse.url,
        // uploadResponse.public_id
      );
  } catch (err) {
      console.error(err);
      res.status(500).json({ err: 'Something went wrong' });
  }
});

module.exports = router;