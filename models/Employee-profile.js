const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const { JobTitles, JobTypes, Days } = require('./items');

const DaysSchema = new mongoose.Schema({
  day: {
    type: String,
    enum: Object.values(Days),
  },
  startAt: { type: Number, min: 0, max: 24 * 60 - 1 },
  endAt: { type: Number, min: 0, max: 24 * 60 - 1 },
});

const EmployeeProfileSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'employee',
    },
    jobTitles: { type: [String], enum: Object.values(JobTitles) },
    jobTypes: { type: [String], enum: Object.values(JobTypes) },
    location: String,
    radius: Number,
    minExpectedWage: Number,

    selfIntroduction: String,
    availability: {
      isAnytime: {
        type: Boolean,
        default: false,
      },
      days: [DaysSchema],
    },
  },
  { timestamps: true }
);

Object.assign(EmployeeProfileSchema.statics, { JobTitles, JobTypes, Days });

module.exports = EmployeeProfile = mongoose.model(
  'employee-profile',
  EmployeeProfileSchema
);
