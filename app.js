
// ==========================================
// Environment Configuration
// ==========================================

// Load environment variables in development mode
if (process.env.NODE_ENV != "production") {
    require('dotenv').config();
}


// ==========================================
// Import Required Modules
// ==========================================

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require("path");
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/expresserror.js');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');

// Import User Model
const User = require('./models/user.js');

// Import Routers
const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const usersRouter = require("./routes/user.js");

// Import Middleware
const { currUser } = require("./middleware.js");


// ==========================================
// Database Connection
// ==========================================

// MongoDB connection URL
const MONGO_URL = 'mongodb://127.0.0.1:27017/wanderlust';

// Connect to MongoDB
main()
    .then(() => {
        console.log("connected to DB");
    })
    .catch(err => {
        console.log(err);
    });

// Main database connection function
async function main() {
    await mongoose.connect(MONGO_URL);
}


// ==========================================
// Express App Configuration
// ==========================================

// Set EJS as the view engine
app.set("view engine", "ejs");

// Set views directory
app.set("views", path.join(__dirname, "views"));

// Configure EJS-Mate as the EJS engine
app.engine('ejs', ejsMate);


// ==========================================
// Application Middlewares
// ==========================================

// Parse incoming URL-encoded form data
app.use(express.urlencoded({ extended: true }));

// Store search query in res.locals
app.use((req, res, next) => {
    res.locals.search = req.query.search || "";
    next();
});

// Support PUT and DELETE methods through forms
app.use(methodOverride("_method"));

// Serve static files from public directory
app.use(express.static(path.join(__dirname, "public")));


// ==========================================
// Session Configuration
// ==========================================

// Configure session options
const sessionOptions = {
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,

    cookie: {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    }
};

// Initialize session and flash messages
app.use(session(sessionOptions));
app.use(flash());


// ==========================================
// Passport Authentication Configuration
// ==========================================

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Configure Local Strategy
passport.use(new LocalStrategy(User.authenticate()));

// Configure user serialization and deserialization
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// ==========================================
// Current User Middleware
// ==========================================

// Make the current logged-in user available to all views
app.use(currUser);


// ==========================================
// Flash Messages Middleware
// ==========================================

// Make success and error flash messages available to views
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});


// ==========================================
// Root Route
// ==========================================

// app.get("/", (req, res) => {
//     res.send("Hi, I'm root");
// });


// ==========================================
// Application Routes
// ==========================================

// Listings routes
app.use("/listings", listingsRouter);

// Reviews routes
app.use("/listings/:id/reviews", reviewsRouter);

// User authentication routes
app.use("/", usersRouter);


// ==========================================
// 404 Error Handler
// ==========================================

// Handle requests for undefined routes
app.all("/{*splat}", (req, res, next) => {
    next(new ExpressError(404, "Page not found!"));
});


// ==========================================
// Global Error Handler
// ==========================================

// Handle application errors and render error page
app.use((err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }

    const { statusCode = 500, message = "Something went wrong!" } = err;

    res.status(statusCode).render("error.ejs", { message });
});


// ==========================================
// Start Express Server
// ==========================================

app.listen(3000, () => {
    console.log("server is listening to port 3000");
});
