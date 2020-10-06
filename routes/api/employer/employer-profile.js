const express = require('express');
const { check, validationResult } = require('express-validator');
const router = express.Router();
const auth = require('../../../middleware/auth');
const normalize = require('normalize-url');

const Profile = require('../../../models/Employer-profile');
const Employer = require('../../../models/Employer-profile');

// @route      GET api/employer-profile/me
// @desc       Get current employer's profile
// @access     Private
router.get('/me', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      employer: req.employer.id,
    }).populate('employer', ['firstName', 'lastName']);

    if (!profile) {
      return res.status(400).json({ msg: 'There is no profile for this user' });
    }

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('server Error');
  }
});

// @route      POST api/employer-profile
// @desc       Create or update employer profile
// @access     Private
router.post(
  '/',
  [
    auth,
    [
      check('name', 'Restaurant name is required').not().isEmpty(),
      check('phone', 'Phone number is required').not().isEmpty().toInt().trim(),
      check('zip', 'Postal code is required')
        .not()
        .isEmpty()
        .matches(
          /^[ABCEGHJKLMNPRSTVXY][0-9][ABCEGHJKLMNPRSTVWXYZ] ?[0-9][ABCEGHJKLMNPRSTVWXYZ][0-9]/
        ),
      check('street', 'Street address is required').not().isEmpty(),
      check('city', 'City is required').not().isEmpty(),
      check('state', 'Province is required').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      name,
      kind,
      phone,
      website,
      zip,
      street,
      city,
      state,
      youtube,
      twitter,
      facebook,
      instagram,
    } = req.body;

    // Build profile object
    const profileFields = {};
    profileFields.employer = req.employer.id;

    // Build restaurant object
    const restaurantFields = {};
    if (name) restaurantFields.name = name;
    if (kind) restaurantFields.kind = kind;
    if (phone) restaurantFields.phone = phone;
    if (website)
      restaurantFields.website = normalize(website, { forceHttps: true });
    profileFields.restaurant = restaurantFields;

    // Build address object
    const addressFields = {};
    if (zip) addressFields.zip = zip;
    if (street) addressFields.street = street;
    if (city) addressFields.city = city;
    if (state) addressFields.state = state;
    restaurantFields.address = addressFields;

    // Build social object
    const socialFields = {};
    if (youtube) socialFields.youtube = youtube;
    if (twitter) socialFields.twitter = twitter;
    if (facebook) socialFields.facebook = facebook;
    if (instagram) socialFields.instagram = instagram;
    for (const [key, value] of Object.entries(socialFields)) {
      if (value && value.length > 0)
        socialFields[key] = normalize(value, { forceHttps: true });
    }
    restaurantFields.social = socialFields;

    try {
      let profile = await Profile.findOne({ employer: req.employer.id });

      if (profile) {
        // Update
        profile = await Profile.findOneAndUpdate(
          { employer: req.employer.id },
          { $set: profileFields },
          { new: true }
        );

        return res.json(profile);
      }

      // Create
      profile = new Profile(profileFields);
      await profile.save();
      return res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

module.exports = router;
