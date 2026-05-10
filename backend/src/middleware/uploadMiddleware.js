const multer = require("multer");
const path = require("path");
const fs = require("fs");
const AppError = require("../utils/AppError");

const uploadDir = path.join(__dirname, "../uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, uploadDir);
  },

  filename(req, file, cb) {
    const safeOriginalName = file.originalname
      .replace(/\s+/g, "-")
      .replace(/[^a-zA-Z0-9.-]/g, "");

    const uniqueName = `${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}-${safeOriginalName}`;

    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedExtensions = /jpeg|jpg|png|webp/;
  const allowedMimeTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
  ];

  const extName = allowedExtensions.test(
    path.extname(file.originalname).toLowerCase()
  );

  const mimeType = allowedMimeTypes.includes(file.mimetype);

  if (extName && mimeType) {
    cb(null, true);
  } else {
    cb(
      new AppError(
        "Invalid file type. Only jpeg, jpg, png, and webp images are allowed",
        400
      )
    );
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
  fileFilter,
});

module.exports = upload;