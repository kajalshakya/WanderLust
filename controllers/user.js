
const User = require("../models/user.js");


// ==========================================
// Render Signup Form
// ==========================================

module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup.ejs");
};


// ==========================================
// User Signup
// ==========================================

module.exports.signup = async (req, res, next) => {

    try {

        // Get User Details from Request Body
        let { username, email, password } = req.body;

        // Create New User
        const newUser = new User({ email, username });

        // Register User Using Passport Local Mongoose
        const registeredUser = await User.register(newUser, password);

        // Automatically Login Registered User
        req.login(registeredUser, (err) => {

            if (err) {
                return next(err);
            }

            req.flash("success", "Welcome to Wanderlust!");
            res.redirect("/listings");
        });

    } catch (e) {

        // Handle Signup Errors
        req.flash("error", e.message);
        res.redirect("/signup");
    }
};


// ==========================================
// Render Login Form
// ==========================================

module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs");
};


// ==========================================
// User Login
// ==========================================

module.exports.login = (req, res) => {

    req.flash("success", "Welcome back to Wanderlust!");

    // Get Redirect URL
    const redirectUrl = res.locals.redirectUrl || "/listings";

    // Clear Saved Redirect URL
    delete req.session.redirectUrl;

    res.redirect(redirectUrl);
};


// ==========================================
// User Logout
// ==========================================

module.exports.logout = (req, res, next) => {

    req.logOut((err) => {

        if (err) {
            return next(err);
        }

        req.flash("success", "You are logged out!");
        res.redirect("/listings");
    });
};
