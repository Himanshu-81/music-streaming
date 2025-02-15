import mongoose from "mongoose";

const artistSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    bio: { type: String },
    profilePicture: { type: String }, // Cloudinary URL
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Artist = mongoose.model("Artist", artistSchema);
