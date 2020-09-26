const express = require('express');
const router = express.Router();

// @route      GET api/job-posts
// @desc       Test route
// @access     Public
router.get('/', (req, res) => res.send('Job posts route'));

module.exports = router;
