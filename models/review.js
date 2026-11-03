
const mongoose = require('mongoose');
const Schema = mongoose.Schema;


// ==========================================
// Review Schema
// ==========================================

const reviewSchema = new Schema({

    // Review Comment
    comment: String,

    // Rating (1 to 5)
    rating: {
        type: Number,
        min: 1,
        max: 5
    },

    // Review Creation Date
    created_at: {
        type: Date,
        default: Date.now()
    },

    // Review Author
    author: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }

});


// ==========================================
// Export Review Model
// ==========================================

module.exports = mongoose.model("Review", reviewSchema);
