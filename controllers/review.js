
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");


// ==========================================
// Create Review
// ==========================================

module.exports.createReview = async (req, res) => {

    // Find Listing by ID
    let listing = await Listing.findById(req.params.id);

    // Check if Listing Exists
    if (!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        return res.redirect("/listings");
    }

    // Create New Review
    let newReview = new Review(req.body.review);

    // Assign Review Author
    newReview.author = req.user._id;

    // Add Review to Listing
    listing.reviews.push(newReview);

    // Save Review and Listing
    await newReview.save();
    await listing.save();

    req.flash("success", "New Review Created!");
    res.redirect(`/listings/${listing._id}`);
};


// ==========================================
// Delete Review
// ==========================================

module.exports.destroyReview = async (req, res) => {

    let { id, reviewId } = req.params;

    // Remove Review Reference from Listing
    let listing = await Listing.findByIdAndUpdate(id, {
        $pull: { reviews: reviewId }
    });

    // Check if Listing Exists
    if (!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        return res.redirect("/listings");
    }

    // Delete Review from Database
    await Review.findByIdAndDelete(reviewId);

    req.flash("success", "Review Deleted!");
    res.redirect(`/listings/${id}`);
};
