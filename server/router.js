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

module.exports = router;