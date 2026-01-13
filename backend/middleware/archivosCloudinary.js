const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "SGA",
        resource_type: "auto",
        allowedFormats: ["jpg", "png", "jpeg", "gif", "webp", "pdf"]
    },
});


const upload = multer({ storage });

module.exports = { upload };