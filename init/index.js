const mongoose = require('mongoose');
const Listing = require('../models/listing');
const initData = require('./data.js');

main().then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('Error connecting to MongoDB', err);
});

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/Rentivo');
};

const initDb = async () => {
    try {
        await Listing.deleteMany({});
        await Listing.insertMany(initData.data);
        console.log("Initialized database with sample data");
    } catch (err) {
        console.error("Error initializing database:", err);
    }
};

initDb();