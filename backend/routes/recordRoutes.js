const express = require('express');
const { getAllOrSearchRecords , updateRecord } = require('../controllers/recordsController');
const { Auth } = require('../controllers/authController');
const router = express.Router();

router.get('/', getAllOrSearchRecords );
router.put('/:id', updateRecord);

module.exports = router;
