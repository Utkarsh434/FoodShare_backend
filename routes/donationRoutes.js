const express = require('express');
const router = express.Router();
const { 
    createDonation, 
    getAvailableDonations, 
    claimDonation,
    getMyDonations,
    getMyClaims 
} = require('../controllers/donationController');
const { protect, authorize } = require('../middleware/authMiddleware');

// --- NEW ROUTES ---
// Must be placed before the '/:id' route to avoid conflicts
router.route('/mydonations').get(protect, authorize('donor'), getMyDonations);
router.route('/myclaims').get(protect, authorize('receiver'), getMyClaims);


// Route to get all available donations and to create a new donation
router.route('/')
    .get(getAvailableDonations)
    .post(protect, authorize('donor'), createDonation);

// Route for a receiver to claim a donation
router.route('/:id/claim').put(protect, authorize('receiver'), claimDonation);


module.exports = router;
