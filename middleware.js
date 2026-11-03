
// ==========================================
// Import Required Modules
// ==========================================

const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const ExpressError = require("./utils/expresserror.js");
const { listingSchema, reviewSchema } = require("./schema.js");


// ==========================================
// Current User Middleware
// ==========================================

// Store the currently logged-in user in res.locals
module.exports.currUser = (req, res, next) => {
    res.locals.currUser = req.user;
    next();
};


// ==========================================
// Authentication Middleware
// ==========================================

// Check whether the user is logged in
// Redirect to login page if not authenticated
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be logged in!");
        return res.redirect("/login");
    }

    next();
};


// ==========================================
// Save Redirect URL Middleware
// ==========================================

// Save the original URL for redirection after login
module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }

    next();
};


// ==========================================
// Listing Owner Authorization
// ==========================================

// Check whether the logged-in user owns the listing
module.exports.isOwner = async (req, res, next) => {
    try {
        const { id } = req.params;
        const listing = await Listing.findById(id);

        // Check if listing exists
        if (!listing) {
            req.flash("error", "Listing does not exist!");
            return res.redirect("/listings");
        }

        // Check listing ownership
        if (!listing.owner || !listing.owner.equals(req.user._id)) {
            req.flash("error", "You are not the owner of this listing!");
            return res.redirect(`/listings/${id}`);
        }

        next();
    } catch (err) {
        next(err);
    }
};


// ==========================================
// Listing Validation Middleware
// ==========================================

// Validate listing data using Joi schema
module.exports.validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);

    if (error) {
        const errMsg = error.details.map(el => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }

    next();
};


// ==========================================
// Review Validation Middleware
// ==========================================

// Validate review data using Joi schema
module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);

    if (error) {
        const errMsg = error.details.map(el => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }

    next();
};


// ==========================================
// Review Author Authorization
// ==========================================

// Check whether the logged-in user is the author of the review
module.exports.isReviewAuthor = async (req, res, next) => {
    try {
        const { reviewId, id } = req.params;
        const review = await Review.findById(reviewId);

        // Check if review exists
        if (!review) {
            req.flash("error", "Review does not exist!");
            return res.redirect(`/listings/${id}`);
        }

        // Check review ownership
        if (!review.author || !review.author.equals(req.user._id)) {
            req.flash("error", "You are not the author of this review!");
            return res.redirect(`/listings/${id}`);
        }

        next();
    } catch (err) {
        next(err);
    }
};
