const express = require('express');
const router = express.Router();
const Listing = require('../models/listing');
const wrapAsync = require('../utils/wrapAsync');
const { isLoggedIn, isOwner, validateListing, validateObjectId, isListingExists } = require('../middlewares');
const listingController = require('../controllers/listing');

//Listings Routes

router.get('/', wrapAsync(listingController.index));

router.get("/new", isLoggedIn, listingController.renderNewForm);

router.get("/:id", validateObjectId, isListingExists, wrapAsync(listingController.renderShowPage));

router.post("/", isLoggedIn, validateListing, wrapAsync(listingController.createListing));

router.get("/:id/edit", validateObjectId, isLoggedIn, isListingExists, isOwner, wrapAsync(listingController.renderEditForm));

router.put("/:id", validateObjectId, isLoggedIn, isListingExists, isOwner, validateListing, wrapAsync(listingController.updateListing));

router.delete("/:id", validateObjectId, isLoggedIn, isListingExists, isOwner, wrapAsync(listingController.deleteListing));

module.exports = router;