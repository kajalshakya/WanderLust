
const Listing = require("../models/listing.js");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");


// ==========================================
// Mapbox Geocoding Configuration
// ==========================================

const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });


// ==========================================
// Index Route with Category Filtering
// ==========================================

module.exports.index = async (req, res) => {

    let { category, search } = req.query;

    let filter = {};

    // Category Filtering
    if (category) {
        filter.category = category;
    }

    // Search Filtering
    if (search && search.trim() !== "") {
        filter.$or = [
            { title: { $regex: search.trim(), $options: "i" } },
            { location: { $regex: search.trim(), $options: "i" } },
            { country: { $regex: search.trim(), $options: "i" } }
        ];
    }

    // Fetch Listings Based on Filters
    let allListings = await Listing.find(filter);

    res.render("listings/index.ejs", {
        allListings,
        search
    });
};


// ==========================================
// New Route
// ==========================================

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};


// ==========================================
// Show Route
// ==========================================

module.exports.showListing = async (req, res) => {

    let { id } = req.params;

    // Fetch Listing with Reviews, Authors and Owner
    const listing = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: {
                path: "author"
            },
        })
        .populate("owner");

    // Check if Listing Exists
    if (!listing) {
        req.flash("error", "Listing does not exist!");
        return res.redirect("/listings");
    }

    res.render("listings/show.ejs", {
        listing,
        reviews: listing.reviews
    });
};


// ==========================================
// Create Route
// ==========================================

module.exports.createListing = async (req, res) => {

    // Get Coordinates Using Mapbox Geocoding
    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1
    }).send();

    // Create New Listing
    const newListing = new Listing(req.body.listing);

    // Assign Listing Owner
    newListing.owner = req.user._id;

    // Upload Listing Image
    if (req.file) {
        newListing.image = {
            url: req.file.path,
            filename: req.file.filename
        };
    }

    // Assign Geographical Coordinates
    newListing.geometry = response.body.features[0].geometry;

    // Save Listing to Database
    let savedListing = await newListing.save();

    console.log("Coordinates:", savedListing.geometry);
    console.log("Saved Listing:", savedListing);

    req.flash("success", "New listing created!");
    res.redirect("/listings");
};


// ==========================================
// Edit Route
// ==========================================

module.exports.renderEditForm = async (req, res) => {

    let { id } = req.params;

    // Find Listing by ID
    const listing = await Listing.findById(id);

    // Optimize Image URL for Preview
    let orginalImageUrl = listing.image.url;
    orginalImageUrl = orginalImageUrl.replace(
        "/upload/",
        "/upload/h_300,w_250,q_80/"
    );

    res.render("listings/edit.ejs", {
        listing,
        orginalImageUrl
    });
};


// ==========================================
// Update Route
// ==========================================

module.exports.updateListing = async (req, res) => {

    let { id } = req.params;

    // Update Listing Details
    let listing = await Listing.findByIdAndUpdate(
        id,
        { ...req.body.listing },
        { returnDocument: "after" }
    );

    // Update Location Coordinates Using Mapbox
    let response = await geocodingClient.forwardGeocode({
        query: `${listing.location}, ${listing.country}`,
        limit: 1
    }).send();

    if (response.body.features.length > 0) {
        listing.geometry = response.body.features[0].geometry;
    }

    // Update Image if Uploaded
    if (req.file) {
        listing.image = {
            url: req.file.path,
            filename: req.file.filename
        };
    }

    // Save Updated Listing
    await listing.save();

    console.log("Updated Coordinates:", listing.geometry);

    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
};


// ==========================================
// Delete Route
// ==========================================

module.exports.destroyListing = async (req, res) => {

    let { id } = req.params;

    // Delete Listing from Database
    await Listing.findByIdAndDelete(id);

    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
};
