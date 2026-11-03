
/* ==========================================
   Import Required Modules
========================================== */

const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary-v2");
// const multer = require("multer");


/* ==========================================
   Cloudinary Configuration
========================================== */

// Configure Cloudinary using environment variables
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});


/* ==========================================
   Cloudinary Storage Configuration
========================================== */

// Configure storage for uploaded listing images
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "Wanderlust_DEV",
        allowedFormats: ["jpeg", "png", "jpg"],
    },
});


/* ==========================================
   Export Cloudinary and Storage
========================================== */

module.exports = {
    cloudinary,
    storage
};
