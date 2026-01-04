const express = require('express');
const router = express.Router({mergeParams: true});
const Listing = require('../models/listing');
const Review = require('../models/review');
const wrapAsync = require('../utils/wrapAsync');
const ExpressError = require('../utils/ExpressError');
const { reviewSchema } = require('../schema');
const mongoose = require('mongoose');


const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(400, msg);
    }
    next();
};


const validateObjectId = (req, res, next) => {
    const { id , reviewId } = req.params;
    if (id && !mongoose.Types.ObjectId.isValid(id)) {
        throw new ExpressError(400, "Invalid Listing ID");
    }
    if (reviewId && !mongoose.Types.ObjectId.isValid(reviewId)) {
        throw new ExpressError(400, "Invalid Review ID");
    }
    next();
};


//Review Routes 

router.post("/", validateReview, validateObjectId, wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        throw new ExpressError(404, 'Listing Not Found');
    }
    const review = new Review(req.body.review);
    await review.save();
    listing.reviews.push(review);
    await listing.save();
    res.redirect("/listings/" + id);
}));

router.delete("/:reviewId", validateObjectId, wrapAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect("/listings/" + id);
}));

module.exports = router;