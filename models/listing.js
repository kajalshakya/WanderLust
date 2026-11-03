
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Review = require("./review.js");
const { required } = require('joi');


// ==========================================
// Listing Schema
// ==========================================

const listingSchema = new Schema({

    // Basic Listing Details
    title: {
        type: String,
        required: true,
    },

    description: String,

    // Listing Image Details
    image: {
        filename: {
            type: String,
            default: "listingimage"
        },
        url: {
            type: String,
            default: "https://images.unsplash.com/photo-1601918774946-25832a4be0d6?w=900&auto=format&fit=crop&q=60"
        }
    },

    // Price and Location Details
    price: Number,
    location: String,
    country: String,

    // Associated Reviews
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review",
        },
    ],

    // Listing Owner
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },

    // Geographical Coordinates
    geometry: {
        type: {
            type: String,
            enum: ["Point"],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },

    // Listing Category
    category: {
        type: String,
        required: true,
        enum: [
            "Trending",
            "Rooms",
            "Iconic cities",
            "Mountains",
            "Castles",
            "Amazing Pools",
            "Camping",
            "Farms",
            "Arctic",
            "Waterfalls",
            "Boats"
        ]
    }

});


// ==========================================
// Delete Associated Reviews Middleware
// ==========================================

listingSchema.post("findOneAndDelete", async (listing) => {
    if (listing) {
        await Review.deleteMany({ _id: { $in: listing.reviews } });
    }
});


// ==========================================
// Listing Model
// ==========================================

const Listing = mongoose.model('Listing', listingSchema);


// ==========================================
// Export Model
// ==========================================

module.exports = Listing;
