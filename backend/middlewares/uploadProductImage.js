const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Absolute path to the 'build' directory in the root of your project
const buildDirectory = path.join(__dirname, '..', 'build');
const productsDirectory = path.join(buildDirectory, 'products');
const customersDirectory = path.join(buildDirectory, 'customer');

// Ensure the 'products' directory exists
if (!fs.existsSync(productsDirectory)) {
  fs.mkdirSync(productsDirectory, { recursive: true });
}

// Ensure the 'customer' directory exists
if (!fs.existsSync(customersDirectory)) {
  fs.mkdirSync(customersDirectory, { recursive: true });
}

// Set up storage for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Determine the upload directory based on the request URL
    const uploadDirectory = req.originalUrl.includes('product') ? productsDirectory : customersDirectory;

    if (!uploadDirectory) {
      return cb(new Error('Invalid destination'), false);
    }

    // Ensure the destination directory exists
    if (!fs.existsSync(uploadDirectory)) {
      fs.mkdirSync(uploadDirectory, { recursive: true });
    }

    cb(null, uploadDirectory);  // Proceed to save the file in the determined directory
  },
  filename: (req, file, cb) => {
    // Use current timestamp for unique filenames
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  if (!allowedTypes.includes(file.mimetype)) {
    return cb(new Error('Only JPEG and PNG images are allowed'), false);
  }
  cb(null, true);
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});

module.exports = upload;
