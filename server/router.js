const express = require('express');
const router = express.Router();

const controllers = require('./controllers/event.controller.js');

//get all events
router.get('/', controllers.getAllEvents);

//add events
router.post('/', controllers.addEvent);

//added delete route to clean up database
router.delete('/:id', controllers.deleteEvent);

module.exports = router;