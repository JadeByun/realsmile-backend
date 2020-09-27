const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');

const Employer = require('../../../models/Employer');

// @route      POST api/employer
// @desc       Register employer
// @access     Public
router.post(
  '/',
  [
    check('firstName', 'First name is required').not().isEmpty(),
    check('lastName', 'Last name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check(
      'password',
      'Password should not be empty, minimum eight characters, at least one letter, one number and one special character'
    )
      .isLength({ min: 8 })
      .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z\d@$.!%*#?&]/),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { firstName, lastName, email, password } = req.body;

    try {
      // See if employer exists
      let employer = await Employer.findOne({ email });

      if (employer) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Employer already exists' }] });
      }

      employer = new Employer({
        firstName,
        lastName,
        email,
        password,
      });

      // Encrypt password using bcrypt
      const salt = await bcrypt.genSalt(10);
      employer.password = await bcrypt.hash(password, salt);

      await employer.save();

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
      res.status(500).send('Server error');
    }
  }
);

module.exports = router;
