const express = require('express');
const router = express.Router();
const Listing = require('../models/listing');
const wrapAsync = require('../utils/wrapAsync');
const { isLoggedIn, isOwner, validateListing, validateObjectId, isListingExists } = require('../middlewares');

//Listings Routes

router.get('/', wrapAsync(async (req, res) => {
    const allListings = await Listing.find();
    res.render("listings/index", { allListings });
}));

router.get("/new", isLoggedIn, (req, res) => {
    res.render("listings/new");
});

router.get("/:id", validateObjectId, isListingExists, wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id).populate({path: 'reviews', populate: {path: 'author'} }).populate('owner');
    res.render("listings/show", { listing });
}));

router.post("/", isLoggedIn, validateListing, wrapAsync(async (req, res) => {
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");

}));

router.get("/:id/edit", validateObjectId, isLoggedIn, isListingExists, isOwner, wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    res.render("listings/edit", { listing });
}));

router.put("/:id", validateObjectId, isLoggedIn, isListingExists, isOwner, validateListing, wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing }, { runValidators: true, new: true });
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
}));

router.delete("/:id", validateObjectId, isLoggedIn, isListingExists, isOwner, wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
}));


module.exports = router;