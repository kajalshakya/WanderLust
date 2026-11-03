
// ==========================================
// Imports
// ==========================================

const express = require('express');
const router = express.Router();

const wrapAsync = require('../utils/wrapAsync.js');
const Listing = require("../models/listing.js");

const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listing.js");

const multer = require('multer');
const { storage } = require("../cloudConfig.js");


// ==========================================
// Multer Configuration
// ==========================================

const upload = multer({ storage });


// ==========================================
// Index and Create Listing Routes
// ==========================================

router
    .route("/")
    .get(wrapAsync(listingController.index))
    .post(
        isLoggedIn,
        upload.single('listing[image][url]'),
        validateListing,
        wrapAsync(listingController.createListing)
    );


// ==========================================
// New Listing Route
// ==========================================

router.get("/new", isLoggedIn, listingController.renderNewForm);


// ==========================================
// Show, Update and Delete Listing Routes
// ==========================================

router
    .route("/:id")
    .get(wrapAsync(listingController.showListing))
    .put(
        isLoggedIn,
        isOwner,
        upload.single('listing[image][url]'),
        validateListing,
        wrapAsync(listingController.updateListing)
    )
    .delete(
        isLoggedIn,
        isOwner,
        wrapAsync(listingController.destroyListing)
    );


// ==========================================
// Edit Listing Route
// ==========================================

router.get(
    "/:id/edit",
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.renderEditForm)
);


// ==========================================
// Export Router
// ==========================================

module.exports = router;
