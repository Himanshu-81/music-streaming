import multer from "multer";

// function for the image upload
const imageStorage = multer.diskStorage({
  destination: "./public/temp/images",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

export const uploadImage = multer({
  storage: imageStorage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"), false);
    }
  },
  limits: { fileSize: 2 * 1024 * 1024 }, // 5MB limit for images
});

// function for the song upload
const songStorage = multer.diskStorage({
  destination: "./public/temp/songs",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

export const uploadSong = multer({
  storage: songStorage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("audio/")) {
      cb(null, true);
    } else {
      cb(new Error("Only audio files are allowed"), false);
    }
  },
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB limit for songs
});
