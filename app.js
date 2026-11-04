
// ==========================================
// Environment Configuration
// ==========================================

// Load environment variables from the .env file in development mode
if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}


// ==========================================
// Import Required Modules
// ==========================================

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/expresserror.js");
const session = require("express-session");
const MongoStore = require("connect-mongo").default;
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");

// Import User Model
const User = require("./models/user.js");

// Import Application Routers
const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const usersRouter = require("./routes/user.js");

// Import Custom Middleware
const { currUser } = require("./middleware.js");


// ==========================================
// Database Connection
// ==========================================

// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const dbUrl = process.env.ATLASDB_URL;

// Establish connection with MongoDB Atlas
main()
    .then(() => {
        console.log("connected to DB");
    })
    .catch(err => {
        console.log(err);
    });

// Main function to connect the application with the database
async function main() {
    await mongoose.connect(dbUrl);
}


// ==========================================
// Express Application Configuration
// ==========================================

// Set EJS as the template engine
app.set("view engine", "ejs");

// Set the path for EJS view files
app.set("views", path.join(__dirname, "views"));

// Configure EJS-Mate for template layouts and reusable components
app.engine("ejs", ejsMate);


// ==========================================
// Application Middlewares
// ==========================================

// Parse incoming URL-encoded form data
app.use(express.urlencoded({ extended: true }));

// Make the search query available to all EJS templates
app.use((req, res, next) => {
    res.locals.search = req.query.search || "";
    next();
});

// Allow PUT and DELETE requests through HTML forms
app.use(methodOverride("_method"));

// Serve static files such as CSS, JavaScript, and images
app.use(express.static(path.join(__dirname, "public")));


// ==========================================
// Session Configuration
// ==========================================

// Create a MongoDB-backed session store
// This stores user sessions in MongoDB Atlas
const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET
    },
    touchAfter: 24 * 3600,
});

// Handle errors related to the MongoDB session store
store.on("error", (err) => {
    console.log("Error in Mongo session store", err);
});

// Configure session options
const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,

    // Configure session cookie settings
    cookie: {
        maxAge: 7 * 24 * 60 * 60 * 1000, // Session expires after 7 days
        httpOnly: true // Prevent client-side JavaScript from accessing the cookie
    }
};

// Initialize sessions and flash messaging
app.use(session(sessionOptions));
app.use(flash());


// ==========================================
// Passport Authentication Configuration
// ==========================================

// Initialize Passport authentication
app.use(passport.initialize());
app.use(passport.session());

// Configure Passport Local Strategy for username and password authentication
passport.use(new LocalStrategy(User.authenticate()));

// Serialize and deserialize users to maintain login sessions
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// ==========================================
// Current User Middleware
// ==========================================

// Make the currently logged-in user available in all EJS templates
app.use(currUser);


// ==========================================
// Flash Messages Middleware
// ==========================================

// Make success and error flash messages available to all views
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});


// ==========================================
// Root Route
// ==========================================

// Handle requests to the root URL
// app.get("/", (req, res) => {
//     res.send("Hi, I'm root");
// });


// ==========================================
// Application Routes
// ==========================================

// Handle all listing-related routes
app.use("/listings", listingsRouter);

// Handle review-related routes for individual listings
app.use("/listings/:id/reviews", reviewsRouter);

// Handle user authentication routes (signup, login, logout)
app.use("/", usersRouter);

// Privacy Policy Route
app.get("/privacy", (req, res) => {
    res.render("listings/privacy");
});

// Terms & Conditions Route
app.get("/terms", (req, res) => {
    res.render("listings/terms");
});


// ==========================================
// 404 Error Handler
// ==========================================

// Handle requests for routes that do not exist
app.all("/{*splat}", (req, res, next) => {
    next(new ExpressError(404, "Page not found!"));
});


// ==========================================
// Global Error Handler
// ==========================================

// Catch and handle application errors
app.use((err, req, res, next) => {
    // Pass the error to the default Express handler if headers are already sent
    if (res.headersSent) {
        return next(err);
    }

    // Extract status code and error message
    const { statusCode = 500, message = "Something went wrong!" } = err;

    // Render the error page with the appropriate message
    res.status(statusCode).render("error.ejs", { message });
});




// ==========================================
// Start Express Server
// ==========================================

// Start the application on port 3000
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
