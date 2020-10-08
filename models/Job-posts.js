const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const { JobTitles, JobTypes, Days } = require('./items');

const DaysSchema = new mongoose.Schema({
  day: {
    type: String,
    enum: Object.values(Days),
  },
  startAt: { type: Date },
  endAt: { type: Date },
});

const JobPostSchema = new Schema(
  {
    employer: {
      type: Schema.Types.ObjectId,
      ref: 'employer',
    },
    name: {
      type: String,
    },
    titles: {
      type: [String],
      enum: Object.values(JobTitles),
      required: true,
    },
    types: { type: [String], enum: Object.values(JobTypes), required: true },
    wage: {
      min: Number,
      max: Number,
    },
    description: { type: [String], required: true },

    workHours: {
      TBD: {
        type: Boolean,
        default: false,
      },
      days: [DaysSchema],
    },

    // if job type is substitue
    date: {
      startAt: Date,
      endAt: Date,
    },
  },
  { timestamps: true }
);

Object.assign(JobPostSchema.statics, { JobTitles, JobTypes, Days });

module.exports = JobPosts = mongoose.model('job-post', JobPostSchema);
