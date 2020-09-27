const express = require('express');
const router = express.Router();

// @route      GET api/employee-profile
// @desc       Test route
// @access     Public
router.get('/', (req, res) => res.send('Employee Profile route'));

module.exports = router;
