const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ExperienceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  restaurant: {
    type: String,
    required: true,
  },
  location: String,
  from: {
    type: Date,
    required: true,
  },
  to: Date,
  current: {
    type: Boolean,
    default: false,
  },
  description: String,
});

const EmployeeSchema = new mongoose.Schema(
  {
    employeeName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: String,
    date: {
      type: Date,
      default: Date.now,
    },
    experience: [ExperienceSchema],
  },
  { timestamps: true }
);

module.exports = Employee = mongoose.model('employee', EmployeeSchema);
