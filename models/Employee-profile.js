const mongoose = require('mongoose');
// add the Currency type to the Mongoose Schema types
require('mongoose-currency').loadType(mongoose);

const EmployeeProfileSchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'employee',
  },
  position: [{ type: String }],
  availability: [
    {
      day: {
        type: Number,
        min: 1,
        max: 7,
      },
      startAt: {
        type: Number,
        min: 0,
        max: 24 * 60 - 1,
      },
      stopAt: { type: Number, min: 0, max: 24 * 60 - 1 },
    },
  ],
  expectedHourlyWage: {
    min: { type: mongoose.Types.Currency },
    max: { type: mongoose.Types.Currency },
  },
});
