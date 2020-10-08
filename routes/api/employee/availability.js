const express = require('express');
const router = express.Router();
const auth = require('../../../middleware/auth');
const { check, validationResult } = require('express-validator');

const Availability = require('../../../models/Availability');
const Employee = require('../../../models/Employee');

// @route      GET api/availability/me
// @desc       Get current employee's availability
// @access     Private
router.get('/me', auth, async (req, res) => {
  try {
    const availability = await Availability.findOne({
      employee: req.employee.id,
    }).populate('employee', ['employeeName', 'avatar']);

    if (!availability) {
      return res
        .status(400)
        .json({ msg: 'There is no availability for this employee' });
    }

    res.json(availability);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route      POST api/availability
// @desc       Create or update employee availability
// @access     Private
router.post(
  '/',
  [
    auth,
    [
      check('jobTitles', 'Job title is required').not().isEmpty(),
      check('jobTypes', 'Job type is required').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      jobTitles,
      jobTypes,
      location,
      radius,
      minExpectedWage,
      selfIntroducation,
      isAnyTime,
      days,
    } = req.body;

    // Build availability object
    const availabilityFields = {
      employee: req.employee.id,
      jobTitles: Array.isArray(jobTitles)
        ? jobTitles
        : jobTitles.split(',').map((jobTitle) => jobTitle.trim()),

      jobTypes: Array.isArray(jobTypes)
        ? jobTypes
        : jobTypes.split(',').map((jobType) => jobType.trim()),
      location,
      radius,
      minExpectedWage,
      selfIntroducation,
      isAnyTime,
      days,
    };

    try {
      // Update or Create
      availability = await Availability.findOneAndUpdate(
        { employee: req.employee.id },
        { $set: availabilityFields },
        { new: true, upsert: true }
      );
      return res.json(availability);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route      GET api/availability
// @desc       Get all employee availabilities
// @access     Public
router.get('/', async (req, res) => {
  try {
    const availabilities = await Availability.find();
    res.json(availabilities);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route      GET api/availability/:employee_id
// @desc       Get availability by employee ID
// @access     Public
router.get('/:employee_id', async (req, res) => {
  try {
    const availability = await Availability.findOne({
      employee: req.params.employee_id,
    });

    if (!availability)
      return res.status(400).json({ msg: 'Availability not found' });

    return res.json(availability);
  } catch (err) {
    console.error(err.message);
    if (err.kind == 'ObjectId') {
      return res.status(400).json({ msg: 'Availability not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route      DELETE api/availability
// @desc       Delete employee availability
// @access     Private
router.delete('/', auth, async (req, res) => {
  try {
    await Availability.findOneAndRemove({ employee: req.employee.id });
    res.json({ msg: 'Availability removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
