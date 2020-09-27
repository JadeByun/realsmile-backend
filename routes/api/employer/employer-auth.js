const express = require('express');
const router = express.Router();
const auth = require('../../../middleware/auth');

const Employer = require('../../../models/Employer');

// @route      GET api/employer-auth
// @desc       Get employer by token
// @access     Private

router.get('/', auth, async (req, res) => {
  try {
    const employer = await Employer.findById(req.employer.id).select(
      '-password'
    );
    res.json(employer);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
