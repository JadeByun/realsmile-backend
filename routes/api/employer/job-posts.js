const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../../middleware/auth');

const Post = require('../../../models/Job-posts');
const Restaurant = require('../../../models/Restaurant');

// @route      POST api/job-posts
// @desc       Create a post
// @access     Private
router.post(
  '/',
  [
    auth,
    [
      check('titles', 'Job title is required').not().isEmpty(),
      check('types', 'Job type is required').not().isEmpty(),
      check('description', 'Job description is required').not().isEmpty(),
      check('from', 'From date is invalid').custom((value, { req }) =>
        req.body.to ? value < req.body.to : true
      ),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const restaurant = await Restaurant.findOne({
        employer: req.employer.id,
      });

      const {
        titles,
        types,
        min,
        max,
        description,
        TBD,
        days,
        startAt,
        endAt,
      } = req.body;

      const workHoursFields = {
        TBD,
        days,
      };

      const dateFields = {
        startAt,
        endAt,
      };

      const wageFields = {
        min,
        max,
      };

      const newPost = new Post({
        employer: req.employer.id,
        name: restaurant.name,
        titles,
        types,
        wage: wageFields,
        description,
        workHours: workHoursFields,
        date: dateFields,
      });

      const post = await newPost.save();
      res.json(post);
    } catch (err) {
      console.error(err.message);
      res.status(500).json('Server Error');
    }
  }
);

// @route      GET api/job-posts
// @desc       Get all posts
// @access     Public
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 });
    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).json('Server Error');
  }
});

// @route      GET api/job-posts/:id
// @desc       Get post by ID
// @access     Public
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }
    res.json(post);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Post not found' });
    }
    res.status(500).json('Server Error');
  }
});

// @route      DELETE api/job-posts/:id
// @desc       Delete a post by ID
// @access     Public
router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    // Check employer
    if (post.employer.toString() !== req.employer.id) {
      return res.status(401).json({ msg: 'Employer not authorized' });
    }

    await post.remove();
    res.json({ msg: 'Post removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Post not found' });
    }
    res.status(500).json('Server Error');
  }
});

module.exports = router;
