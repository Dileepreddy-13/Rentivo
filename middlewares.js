const Listing = require("./models/listing");
const ExpressError = require('./utils/ExpressError');
const { listingSchema, reviewSchema} = require('./schema');
const mongoose = require('mongoose');
const Review = require("./models/review");


module.exports.validateObjectId = (req, res, next) => {
    const { id , reviewId } = req.params;
    if (id && !mongoose.Types.ObjectId.isValid(id)) {
        throw new ExpressError(400, "Invalid Listing ID");
    }
    if (reviewId && !mongoose.Types.ObjectId.isValid(reviewId)) {
        throw new ExpressError(400, "Invalid Review ID");
    }
    next();
};

module.exports.validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(400, msg);
    }
    next();
};



module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(400, msg);
    }
    next();
};

module.exports.isListingExists = async (req, res, next) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing Not Found");
        return res.redirect("/listings");
    }
    next();
};

module.exports.isReviewExists = async (req, res, next) => {
    const { reviewId, id } = req.params;
    const review = await Review.findById(reviewId);
    if (!review) {
        req.flash("error", "Review Not Found");
        return res.redirect("/listings/" + id);
    }
    next();
};

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash('error', 'You must be signed in first!');
        return res.redirect('/login');
    }
    next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
        delete req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner = async (req, res, next) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error", "Listing Not Found");
        return res.redirect("/listings");
    }
    if (!listing.owner.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to edit this listing!');
        return res.redirect(`/listings/${id}`);
    }
    next();
};



module.exports.isAuthor = async (req, res, next) => {
    const { id , reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if(!review){
        req.flash("error", "Review Not Found");
        return res.redirect(`/listings/${id}`);
    }
    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to edit this review!');
        return res.redirect(`/listings/${id}`);
    }
    next();
};

