const express = require('express');
const { getPriceRange } = require('../controllers/priceRangeController');

const router = express.Router();
router.get('/', getPriceRange);

module.exports = router;
