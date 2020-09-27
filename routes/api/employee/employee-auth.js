const express = require('express');
const router = express.Router();
const auth = require('../../../middleware/auth');

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

module.exports = router;
