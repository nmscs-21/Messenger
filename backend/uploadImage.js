// Import cloudinary library
const cloudinary = require("cloudinary").v2;

// Configure Cloudinary with credentials from environment variables
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// Define options for image upload
const opts = {
  overwrite: true, // overwrite existing images with same public ID
  invalidate: true, // Invalidate CDN cache for the uploaded image
  resource_type: "auto", //Automatically detect the resource type
};

// Export a function for uploading an image to cloudinary
module.exports = (image) => {
  return new Promise((resolve, reject) => {
    // Use cloudinary uploader to upload the image
    cloudinary.uploader.upload(image, opts, (error, result) => {
      if (result && result.secure_url) {
        console.log(result.secure_url);
        return resolve(result.secure_url);
      }
      console.log(error.message);
      return reject({ message: error.message });
    });
  });
};
