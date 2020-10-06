const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EmployerProfileSchema = new mongoose.Schema(
  {
    employer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'employer',
    },
    restaurant: {
      name: {
        type: String,
        required: true,
      },
      kind: String,
      phone: [
        {
          type: Number,
          required: true,
        },
      ],
      website: String,
      address: {
        zip: {
          type: String,
          required: true,
        },
        street: {
          type: String,
          required: true,
        },
        city: {
          type: String,
          required: true,
        },
        state: {
          type: String,
          uppercase: true,
          required: true,
        },
      },
      social: {
        youtube: { type: String },
        twitter: { type: String },
        facebook: { type: String },
        instagram: { type: String },
      },
    },
  },
  { timestamps: true }
);

module.exports = EmployerProfile = mongoose.model(
  'employer-profile',
  EmployerProfileSchema
);
