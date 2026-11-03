
const Joi = require('joi');

// ==========================================
// Listing Validation Schema
// ==========================================

module.exports.listingSchema = Joi.object({
    listing: Joi.object({

        // Basic listing details
        title: Joi.string().required(),
        description: Joi.string().required(),

        // Location details
        location: Joi.string().required(),
        country: Joi.string().required(),

        // Listing price and category
        price: Joi.number().required().min(0),
        category: Joi.string().required(),

        // Listing image details
        image: Joi.object({
            url: Joi.string().allow("", null)
        }).optional()

    }).required()
});


// ==========================================
// Review Validation Schema
// ==========================================

module.exports.reviewSchema = Joi.object({
    review: Joi.object({

        // Review rating (1 to 5)
        rating: Joi.number().required().min(1).max(5),

        // Review comment
        comment: Joi.string().required(),

    }).required()
});
