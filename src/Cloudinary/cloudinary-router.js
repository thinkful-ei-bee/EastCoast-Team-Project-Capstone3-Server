const multer = require('multer')
const cloudinary = require('cloudinary')

cloudinary.config({
    cloud_name: dlmseguh5,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})