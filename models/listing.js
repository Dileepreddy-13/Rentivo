const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review');

const ListingSchema = new Schema({
    title: {
        type: String, 
        required: true
    },
    description: {
        type: String
    },
    price: {
        type: Number, 
        required: true
    },
    location: {
        type: String, 
        required: true
    },
    country:{
        type: String,
        required: true
    },
    image: {
        type: String,
        default: "https://i0.wp.com/impactify.io/wp-content/uploads/2024/05/placeholder-5.png?ssl=1",
        set:(v) => {
            return v==="" ? "https://i0.wp.com/impactify.io/wp-content/uploads/2024/05/placeholder-5.png?ssl=1" : v;
        }
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
});

ListingSchema.post('findOneAndDelete', async function(doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        });
    }
});

const Listing = mongoose.model('Listing', ListingSchema);
module.exports = Listing;