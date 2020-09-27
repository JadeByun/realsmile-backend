const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const auth = require('../../../middleware/auth');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');

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

// @route      POST api/employer-auth
// @desc       Authenticate employer & get token
// @access     Public

router.post(
  '/',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password id required').exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ erros: errors.array() });
    }

    const { email, password } = req.body;

    try {
      // See if employer exists
      let employer = await Employer.findOne({ email });

      if (!employer) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invaild Credentials' }] });
      }

      // Make sure that passwords match
      const isMatch = await bcrypt.compare(password, employer.password);

      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invaild Credentials' }] });
      }

      // Return jsonwebtoken
      const payload = {
        employer: {
          id: employer.id,
        },
      };

      jwt.sign(
        payload,
        config.get('jwtToken'),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw error;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

module.exports = router;
