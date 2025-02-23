import mongoose, { Schema } from "mongoose";

const songSchema = new Schema(
  {
    songName: {
      type: String,
      required: true,
    },

    genre: {
      type: String,
      enum: [
        "Pop",
        "Rock",
        "Jazz",
        "Classical",
        "Hip-hop",
        "Electronic",
        "Bollywood",
        "Other",
      ],
      default: "Other",
    },

    artist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Artist",
      required: true,
    },

    songCoverImage: {
      url: { type: String, required: true },
      publicId: { type: String, required: true },
    },

    songUrl: {
      url: { type: String, required: true },
      publicId: { type: String, required: true },
    },
  },
  { timestamps: true }
);

export const Song = mongoose.model("Song", songSchema);
