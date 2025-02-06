import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import ApiError from "./apiError.js"; // Ensure this is properly handled in your project

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Helper function to delete local file safely
const removeLocalFile = (filePath) => {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};

// Upload Image Function
const uploadImage = async (imagePath) => {
  try {
    if (!imagePath) throw new ApiError("No image file provided", 400);

    // Upload the image to Cloudinary
    const response = await cloudinary.uploader.upload(imagePath, {
      resource_type: "image",
      folder: "avatars",
    });

    // Remove the local file after successful upload
    removeLocalFile(imagePath);
    return response.secure_url; // Return only the URL to store in DB
  } catch (error) {
    removeLocalFile(imagePath);
    throw new ApiError("Image upload failed", 500);
  }
};

// Upload Song Function
const uploadSong = async (songPath) => {
  try {
    if (!songPath) throw new ApiError("No song file provided", 400);

    // Upload the song to Cloudinary
    const response = await cloudinary.uploader.upload(songPath, {
      resource_type: "video", // Cloudinary handles audio files under "video"
      folder: "songs",
    });

    // Remove the local file after successful upload
    removeLocalFile(songPath);
    return response.secure_url; // Return only the URL to store in DB
  } catch (error) {
    removeLocalFile(songPath);
    throw new ApiError("Song upload failed", 500);
  }
};

export { uploadImage, uploadSong };
