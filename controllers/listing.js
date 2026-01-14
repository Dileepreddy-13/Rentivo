const Listing = require("../models/listing");
const geocodeLocation = require("../utils/geocode");


module.exports.index = async (req, res) => {
    const allListings = await Listing.find();
    res.render("listings/index", { allListings });
}

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new");
}

module.exports.renderShowPage = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id).populate({ path: 'reviews', populate: { path: 'author' } }).populate('owner');
    res.render("listings/show", { listing });
}

module.exports.createListing = async (req, res) => {

    const newListing = new Listing(req.body.listing);
    const coordinates = await geocodeLocation(newListing.location);
    if (!coordinates) {
        req.flash("error", "Location not found");
        return res.redirect("/listings/new");
    }

    newListing.owner = req.user._id;
    if (req.file) {
        newListing.image = {
            url: req.file.path,
            filename: req.file.filename
        };
    }
    newListing.geometry = {
        type: 'Point',
        coordinates: coordinates
    };
    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
}

module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    res.render("listings/edit", { listing });
}

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (req.body.listing.location !== listing.location) {
        const coordinates = await geocodeLocation(req.body.listing.location);

        if (!coordinates) {
            req.flash("error", "Location not found");
            return res.redirect(`/listings/${id}`);
        }

        listing.geometry = {
            type: "Point",
            coordinates
        };
    }

    listing.set(req.body.listing);

    if (req.file) {
        listing.image = {
            url: req.file.path,
            filename: req.file.filename
        };
        
    }
    await listing.save();
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
}

module.exports.deleteListing = async (req, res) => {
    let { id } = req.params;
    await Listing.findOneAndDelete({ _id: id });
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
}