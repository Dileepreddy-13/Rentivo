const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Listing = require('./models/listing');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require("ejs-mate")
const wrapAsync = require('./utils/wrapAsync');
const ExpressError = require('./utils/ExpressError');
const joi = require('joi');
const { listingSchema, reviewSchema } = require('./schema');
const Review = require('./models/review');


app.use(methodOverride('_method'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.engine("ejs", ejsMate);

main().then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('Error connecting to MongoDB', err);
});

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/Rentivo');
}

const validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(400, msg);
    }
    next();
};

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(400, msg);
    }
    next();
};


const validateObjectId = (req, res, next) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ExpressError(400, "Invalid Listing ID");
    }
    next();
};


//Listings Routes

app.get('/', (req, res) => {
    res.send('Welcome to Rentivo!');
});

app.get('/listings', wrapAsync(async (req, res) => {
    const allListings = await Listing.find();
    res.render("listings/index", { allListings });
}));

app.get("/listings/new", (req, res) => {
    res.render("listings/new");
});

app.get("/listings/:id",validateObjectId, wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing) {
        throw new ExpressError(404, 'Listing Not Found');
    }
    res.render("listings/show", { listing });
}));

app.post("/listings", validateListing, wrapAsync(async (req, res) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");

}));

app.get("/listings/:id/edit", validateObjectId, wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing) {
        throw new ExpressError(404, 'Listing Not Found');
    }
    res.render("listings/edit", { listing });
}));

app.put("/listings/:id", validateListing, validateObjectId, wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing }, { runValidators: true, new: true });
    res.redirect("/listings" + "/" + id);
}));

app.delete("/listings/:id", validateObjectId, wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
}));

//Review Routes 

app.post("/listings/:id/reviews", validateReview, validateObjectId, wrapAsync(async (req, res) => {
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

app.all(/.*/, (req, res, next) => {
    next(new ExpressError(404, 'Page Not Found'));
});

app.use((err, req, res, next) => {
    let { statusCode = 500, message = 'Something went wrong' } = err;
    res.status(statusCode).render("listings/error", { message });
});

app.listen(8080, () => {
    console.log('Server is running on port 8080');
});
