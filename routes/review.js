const express = require('express');
const router = express.Router({mergeParams: true});
const Listing = require('../models/listing');
const Review = require('../models/review');
const wrapAsync = require('../utils/wrapAsync');
const { isLoggedIn, validateReview, validateObjectId, isListingExists, isReviewExists, isAuthor } = require('../middlewares');

//Review Routes 

router.post("/", validateObjectId,  isLoggedIn, isListingExists, isAuthor, validateReview, wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    console.log(review);
    await review.save();
    listing.reviews.push(review);
    await listing.save();
    req.flash("success", "New Review Created!");
    res.redirect("/listings/" + id);
}));

router.delete("/:reviewId", validateObjectId,  isLoggedIn, isListingExists, isReviewExists, isAuthor, wrapAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review Deleted!");
    res.redirect("/listings/" + id);
}));

module.exports = router;