const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RestaurantSchema = new mongoose.Schema(
  {
    employer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'employer',
    },
    name: {
      type: String,
      required: true,
    },
    category: String,
    phones: {
      mobile: String,
      work: String,
    },

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
  { timestamps: true }
);

module.exports = Restaurant = mongoose.model('restaurant', RestaurantSchema);
