const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Folder where files are stored: backend/uploads
const uploadFolder = path.join(__dirname, "..", "uploads");

// Create the folder automatically if it does not exist
if (!fs.existsSync(uploadFolder)) {
  fs.mkdirSync(uploadFolder, { recursive: true });
}

// Decide where and with what name to save the file
const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, uploadFolder);
  },
  filename: function (req, file, callback) {
    // Unique name so two students uploading "notes.pdf" never overwrite each other
    const uniqueNumber = Date.now() + "-" + Math.round(Math.random() * 1000000000);
    const extension = path.extname(file.originalname).toLowerCase();
    callback(null, uniqueNumber + extension);
  },
});

const allowedExtensions = [".pdf", ".jpg", ".jpeg", ".png"];
const allowedMimeTypes = ["application/pdf", "image/jpeg", "image/png"];

// Accept only PDF, JPG, JPEG, PNG
function fileFilter(req, file, callback) {
  const extension = path.extname(file.originalname).toLowerCase();

  if (allowedExtensions.includes(extension) && allowedMimeTypes.includes(file.mimetype)) {
    callback(null, true);
  } else {
    callback(new Error("Invalid file type. Only PDF, JPG, JPEG and PNG files are allowed."));
  }
}

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
});

// Wrapper so upload errors become friendly 400 responses
function uploadDocument(req, res, next) {
  // "document" must match the field name used in the React FormData
  upload.single("document")(req, res, function (error) {
    if (error) {
      if (error instanceof multer.MulterError && error.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({ message: "File is too large. Maximum size is 5 MB." });
      }
      return res.status(400).json({ message: error.message });
    }
    next();
  });
}

module.exports = uploadDocument;
