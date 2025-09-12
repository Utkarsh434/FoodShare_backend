const Donation = require('../models/Donation');
const User = require('../models/User');

// @desc    Create a new donation
// @route   POST /api/donations
// @access  Private (Donors only)
const createDonation = async (req, res) => {
  try {
    const { category, foodType, quantity, bestBefore, location, image } = req.body;

    const newDonation = new Donation({
      donor: req.user.id,
      category,
      foodType,
      quantity,
      bestBefore,
      location,
      image,
    });

    const savedDonation = await newDonation.save();
    res.status(201).json(savedDonation);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get all available donations
// @route   GET /api/donations
// @access  Public
const getAvailableDonations = async (req, res) => {
    try {
        const donations = await Donation.find({ status: 'available' })
            .populate('donor', 'name')
            .sort({ createdAt: -1 });
        res.json(donations);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Claim a donation (handles race conditions)
// @route   PUT /api/donations/:id/claim
// @access  Private (Receivers only)
const claimDonation = async (req, res) => {
  try {
    const donationId = req.params.id;
    // We get the user's ID from the 'protect' middleware
    const receiverId = req.user.id;
    const updatedDonation = await Donation.findOneAndUpdate(
      { _id: donationId, status: 'available' },
      { 
        status: 'claimed',
        receiver: receiverId // Assign the logged-in user as the receiver
      },
      { new: true } // This option tells Mongoose to return the document after the update
    );

    if (!updatedDonation) {
      return res.status(409).json({ msg: 'Sorry, this donation has already been claimed.' });
    }

    // If the update was successful, send a success response.
    res.status(200).json({ msg: 'Donation claimed successfully', donation: updatedDonation });

  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

// --- NEW FUNCTION ---
// @desc    Get all donations for the logged-in donor
// @route   GET /api/donations/mydonations
// @access  Private (Donors only)
const getMyDonations = async (req, res) => {
    try {
        const donations = await Donation.find({ donor: req.user.id }).sort({ createdAt: -1 });
        res.json(donations);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
};

// --- NEW FUNCTION ---
// @desc    Get all claimed donations for the logged-in receiver
// @route   GET /api/donations/myclaims
// @access  Private (Receivers only)
const getMyClaims = async (req, res) => {
    try {
        const donations = await Donation.find({ receiver: req.user.id }).sort({ createdAt: -1 });
        res.json(donations);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
};


module.exports = {
  createDonation,
  getAvailableDonations,
  claimDonation,
  getMyDonations,
  getMyClaims,
};
