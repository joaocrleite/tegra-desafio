const express = require('express');
const router = express.Router();

const HomeController = require('../app/controllers/HomeController');
const SearchController = require('../app/controllers/SearchController');

router.get('/', HomeController.index);
router.post('/search', SearchController.index);


module.exports = router;