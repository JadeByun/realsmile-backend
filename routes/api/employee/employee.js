const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');
const auth = require('../../../middleware/auth');

const Employee = require('../../../models/Employee');

// @route      POST api/employee
// @desc       Register employee
// @access     Public
router.post(
  '/',
  [
    check('employeeName', 'Employee name is required').not().isEmpty(),
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

    const { employeeName, email, password } = req.body;

    try {
      // See if employee exists
      let employee = await Employee.findOne({ email });

      if (employee) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Employee already exists' }] });
      }

      // Get employee's gravatar
      const avatar = gravatar.url(email, {
        s: '200',
        r: 'pg',
        d: 'mm',
      });

      employee = new Employee({
        employeeName,
        email,
        avatar,
        password,
      });

      // Encrypt password using bcrypt
      const salt = await bcrypt.genSalt(10);
      employee.password = await bcrypt.hash(password, salt);

      await employee.save();

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

// @route      PUT api/employee/experience
// @desc       Add employee experience
// @access     Priavte
router.put(
  '/experience',
  [
    auth,
    [
      check('title', 'Title is required').not().isEmpty(),
      check('restaurant', 'Restaurant is required').not().isEmpty(),
      check('from', 'From date is required')
        .not()
        .isEmpty()
        .custom((value, { req }) => (req.body.to ? value < req.body.to : true)),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      title,
      restaurant,
      location,
      from,
      to,
      current,
      description,
    } = req.body;

    const newExp = {
      title,
      restaurant,
      location,
      from,
      to,
      current,
      description,
    };

    try {
      const employee = await Employee.findById(req.employee.id);
      employee.experience.unshift(newExp);
      await employee.save();
      res.json(employee);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

module.exports = router;
