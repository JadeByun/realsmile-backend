const express = require('express');
const router = express.Router();
const auth = require('../../../middleware/auth');
const { check, validationResult } = require('express-validator');

const Profile = require('../../../models/Employee-profile');
const Employee = require('../../../models/Employee');

// @route      GET api/employee-profile/me
// @desc       Get current employee's profile
// @access     Private
router.get('/me', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      employee: req.employee.id,
    }).populate('employee', ['employeeName', 'avatar']);

    if (!profile) {
      return res.status(400).json({ msg: 'There is no profile for this user' });
    }

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route      POST api/employee-profile
// @desc       Create or update employee profile
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

    // Build profile object
    const profileFields = {
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
    };

    const availabilityFields = {
      isAnyTime,
      days,
    };
    profileFields.availability = availabilityFields;

    try {
      // Update or Create
      profile = await Profile.findOneAndUpdate(
        { employee: req.employee.id },
        { $set: profileFields },
        { new: true, upsert: true }
      );
      return res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

module.exports = router;
