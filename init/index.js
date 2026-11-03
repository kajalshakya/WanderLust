
require('dotenv').config();

const mongoose = require('mongoose');
const initData = require('./data.js');
const Listing = require('../models/listing.js');

const MONGO_URL = 'mongodb://127.0.0.1:27017/wanderlust';


// ==========================================
// Database Connection
// ==========================================

main()
    .then(() => {
        console.log("connected to DB");
    })
    .catch(err => {
        console.log(err);
    });


// ==========================================
// Main Function
// ==========================================

async function main() {

    // Connect to MongoDB
    await mongoose.connect(MONGO_URL);

    // Initialize Database
    await initDB();

    // Close Database Connection
    await mongoose.connection.close();
}


// ==========================================
// Update Categories in Existing Listings
// ==========================================

const initDB = async () => {

    // Prepare Bulk Update Operations
    const operations = initData.data.map((obj) => ({
        updateOne: {
            filter: { title: obj.title },
            update: {
                $set: {
                    category: obj.category
                }
            }
        }
    }));

    // Execute Bulk Update
    const result = await Listing.bulkWrite(operations);

    // Display Update Results
    console.log("Categories updated successfully!");
    console.log("Matched listings:", result.matchedCount);
    console.log("Modified listings:", result.modifiedCount);
};
