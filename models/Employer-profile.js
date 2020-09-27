const mongoose = require('mongoose');

const EmployerProfileSchema = new mongoose.Schema({
  employer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'employer',
  },
  restaurant: {
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    phone: [
      {
        type: Number,
        required: true,
      },
    ],
    address: [
      {
        zip: {
          type: Number,
          required: true,
        },
        street: {
          type: String,
          required: true,
        },
        city: {
          type: String,
          uppercase: true,
          required: true,
        },
        state: {
          type: String,
          required: true,
        },
      },
    ],
    website: { type: string },
    social: {
      youtube: { type: string },
      twitter: { type: string },
      facebook: { type: string },
      instagram: { type: string },
    },
  },
});
