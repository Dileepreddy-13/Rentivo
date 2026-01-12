const express = require('express');
const router = express.Router({mergeParams: true});
const Listing = require('../models/listing');
const Review = require('../models/review');
const wrapAsync = require('../utils/wrapAsync');
const { isLoggedIn, validateReview, validateObjectId, isListingExists, isReviewExists, isAuthor } = require('../middlewares');
const reviewController = require('../controllers/review');

//Review Routes 

router.post("/", validateObjectId,  isLoggedIn, isListingExists, validateReview, wrapAsync(reviewController.createReview));

router.delete("/:reviewId", validateObjectId,  isLoggedIn, isListingExists, isReviewExists, isAuthor, wrapAsync(reviewController.deleteReview));

module.exports = router;