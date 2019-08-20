const express = require('express');
const router = express.Router();

const HomeController = require('../app/controllers/HomeController');
const SearchController = require('../app/controllers/SearchController');
const AirportController = require('../app/controllers/AirportController');
const FlightController = require('../app/controllers/FlightController');

router.get('/', HomeController.index);
router.get('/import/99planes', HomeController.ninenineplanes);
router.get('/import/uberair', HomeController.uberair);


router.post('/search', SearchController.index);
router.get('/airports', AirportController.index);
router.get('/flights', FlightController.index);

module.exports = router;