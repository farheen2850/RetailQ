const express = require('express');
const { uploadCSV } = require('../controllers/uploadController');
const multer = require('multer');

const router = express.Router();

const upload = multer({ dest: 'uploads/' });

router.post("/", upload.single("file"), uploadCSV);

module.exports = router;
