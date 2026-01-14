const mongoose = require('mongoose');
const Listing = require('../models/listing');
const initData = require('./data.js');
const geocodeLocation = require("../utils/geocode");

main().catch(err => console.error(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/Rentivo');
  console.log('Connected to MongoDB');
  await initDb();
  mongoose.connection.close();
}

const initDb = async () => {
  try {
    await Listing.deleteMany({});

    for (let obj of initData.data) {
      const coordinates = await geocodeLocation(obj.location);

      if (!coordinates) {
        console.log(`Skipping location: ${obj.location}`);
        continue;
      }

      const listing = new Listing({
        ...obj,
        owner: "695d7e80da7c9faf9f37ed7f", 
        geometry: {
          type: "Point",
          coordinates
        }
      });

      await listing.save();
      console.log(`Saved: ${listing.title}`);
    }

    console.log("Database initialized with geometry data");
  } catch (err) {
    console.error("Error initializing database:", err);
  }
};
