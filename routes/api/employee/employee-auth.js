const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const auth = require('../../../middleware/auth');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');

const Employee = require('../../../models/Employee');

// @route      GET api/employee-auth
// @desc       Get employee by token
// @access     Private

router.get('/', auth, async (req, res) => {
  try {
    const employee = await Employee.findById(req.employee.id).select(
      '-password'
    );
    res.json(employee);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route      POST api/employee-auth
// @desc       Authenticate employee & get token
// @access     Public

router.post(
  '/',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      // See if employee exists
      let employee = await Employee.findOne({ email });

      if (!employee) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid Credentials' }] });
      }

      // Make sure that passwords match
      const isMatch = await bcrypt.compare(password, employee.password);

      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid Credentials' }] });
      }

      // Return jsonwebtoken
      const payload = {
        employee: {
          id: employee.id,
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
