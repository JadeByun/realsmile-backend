const express = require('express');
const { check, validationResult } = require('express-validator');
const router = express.Router();
const auth = require('../../../middleware/auth');
const normalize = require('normalize-url');

// Require PhoneNumberFormat
const PNF = require('google-libphonenumber').PhoneNumberFormat;

// Get an instance of PhoneNumberUtil
const phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();

const Restaurant = require('../../../models/Restaurant');

// @route      GET api/restaurant/me
// @desc       Get current employer's restaurant
// @access     Private
router.get('/me', auth, async (req, res) => {
  console.log(req.employer.id);
  try {
    const restaurant = await Restaurant.findOne({
      employer: req.employer.id,
    }).populate('employer', ['firstName', 'lastName']);

    if (!restaurant) {
      return res
        .status(400)
        .json({ msg: 'There is no restaurant for this employer' });
    }

    res.json(restaurant);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('server Error');
  }
});

// @route      POST api/restaurant
// @desc       Create or update employer restaurant
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
      category,
      mobile,
      work,
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

    // Build restaurant object
    const restaurantFields = {};
    restaurantFields.employer = req.employer.id;

    if (name) restaurantFields.name = name;
    if (category) restaurantFields.category = category;
    if (website)
      restaurantFields.website = normalize(website, { forceHttps: true });

    const phoneFields = {};
    if (mobile) {
      const formatted = phoneUtil.format(
        phoneUtil.parse(mobile, 'CA'),
        PNF.NATIONAL
      );
      phoneFields.mobile = formatted;
    }
    if (work) {
      const formatted = phoneUtil.format(
        phoneUtil.parse(mobile, 'CA'),
        PNF.NATIONAL
      );
      phoneFields.work = formatted;
    }
    restaurantFields.phones = phoneFields;

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
      let restaurant = await Restaurant.findOne({ employer: req.employer.id });

      if (restaurant) {
        // Update
        restaurant = await Restaurant.findOneAndUpdate(
          { employer: req.employer.id },
          { $set: restaurantFields },
          { new: true }
        );

        return res.json(restaurant);
      }

      // Create
      restaurant = new Restaurant(restaurantFields);
      await restaurant.save();
      return res.json(restaurant);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route      GET api/restaurant
// @desc       Get all employer restaurants
// @access     Public
router.get('/', async (req, res) => {
  try {
    const restaurants = await Restaurant.find();
    res.json(restaurants);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route      GET api/availability/:employee_id
// @desc       Get availability by employee ID
// @access     Public
router.get('/:employer_id', async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({
      employer: req.params.employer_id,
    });

    if (!restaurant)
      return res.status(400).json({ msg: 'Restaurant not found' });

    return res.json(restaurant);
  } catch (err) {
    console.error(err.message);
    if (err.kind == 'ObjectId') {
      return res.status(400).json({ msg: 'Restaurant not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route      DELETE api/restaurant
// @desc       Delete employer restaurant
// @access     Private
router.delete('/', auth, async (req, res) => {
  try {
    await Restaurant.findByIdAndRemove({ employer: req.employer.id });
    res.json({ mes: 'Restaurant removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
