
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose").default;


// ==========================================
// User Schema
// ==========================================

const userSchema = new Schema({

    // User Email
    email: {
        type: String,
        required: true
    }

});


// ==========================================
// Passport Local Mongoose Plugin
// ==========================================

userSchema.plugin(passportLocalMongoose);


// ==========================================
// Export User Model
// ==========================================

module.exports = mongoose.model("User", userSchema);
