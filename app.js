const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require("ejs-mate")
const ExpressError = require('./utils/ExpressError');
const listings = require('./routes/listing');
const reviews = require('./routes/review');


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


app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);

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
