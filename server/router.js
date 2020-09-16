const express = require('express');
const router = express.Router();

const controllers = require('./controllers/party.controller.js');

router.get('/parties', controllers.getAllParties);
router.post('/parties', controllers.addParty);
router.delete('/parties/:id', controllers.deleteParty);
router.get('/parties/:userId', controllers.getUsersParties);
router.post('/parties/:id/going', controllers.goingToParty);
router.post('/parties/:id/maybe', controllers.maybeGoingToParty);
router.post('/parties/:id/not', controllers.notGoingToParty);
router.post('/upload', controllers.uploadToCloudinary);

module.exports = router;