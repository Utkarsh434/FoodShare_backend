const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  donor: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  // --- NEW FIELD ---
  // This will store the ID of the user who claims the donation.
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // It also references the User model
  },
  category: {
    type: String,
    required: [true, 'Please select a category'],
    enum: ['Cooked Meal', 'Fresh Produce', 'Bakery', 'Dairy', 'Packaged Goods'],
  },
  foodType: {
    type: String,
    required: [true, 'Please specify the name of the food'],
    trim: true,
  },
  quantity: {
    type: String,
    required: [true, 'Please specify the quantity'],
  },
  bestBefore: {
    type: Date,
    required: [true, 'Please specify when the food should be consumed by'],
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
    address: {
        type: String,
        required: [true, 'Please provide an address'],
    }
  },
  status: {
    type: String,
    required: true,
    enum: ['available', 'claimed', 'delivered'],
    default: 'available',
  },
  image: {
    type: String, 
  },
}, {
  timestamps: true,
});

donationSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Donation', donationSchema);
