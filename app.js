const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Listing = require('./models/listing');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require("ejs-mate")
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

app.get('/', (req, res) => {
    res.send('Welcome to Rentivo!');
});

app.get('/listings', async (req, res) => {
    try {
        const allListings = await Listing.find();
        res.render("listings/index", { allListings });
    } catch (err) {
        console.error("Error fetching listings:", err);
        res.send("error");
    }
});


app.get("/listings/new", (req, res) => {
    res.render("listings/new");
});

app.get("/listings/:id", async (req, res) => {
    let { id } = req.params;
    try{
        let listing = await Listing.findById(id);
        res.render("listings/show", { listing });
    } catch (err) {
        console.error("Error fetching listing:", err);
        res.send("error");
    }
});

app.post("/listings", async (req, res) => {
    try {
        const newListing = new Listing(req.body.listing);
        await newListing.save();
        res.redirect("/listings");
    } catch (err) {
        console.error("Error creating listing:", err);
        res.send("error");
    }
});

app.get("/listings/:id/edit", async (req, res) => {
    let { id } = req.params;
    try {
        let listing = await Listing.findById(id);
        res.render("listings/edit", { listing });
    } catch (err) {
        console.error("Error fetching listing:", err);
        res.send("error");
    }
});

app.put("/listings/:id", async (req, res) => {
    let { id } = req.params;
    try {
        await Listing.findByIdAndUpdate(id, { ...req.body.listing }, { runValidators: true , new: true});
        res.redirect("/listings"+"/"+id);
    } catch (err) {
        console.error("Error updating listing:", err);
        res.send("error");
    }
});

app.delete("/listings/:id", async (req, res) => {
    let { id } = req.params;
    try {
        await Listing.findByIdAndDelete(id);
        res.redirect("/listings");
    } catch (err) {
        console.error("Error deleting listing:", err);
        res.send("error");
    }
});

app.listen(8080, () => {
    console.log('Server is running on port 8080');
});