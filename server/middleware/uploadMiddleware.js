const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
require('dotenv').config();

// Cloudinary automatically configures itself when CLOUDINARY_URL is present in process.env

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'launchpad_profiles',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp']
  }
});

const upload = multer({ storage: storage });

module.exports = upload;
