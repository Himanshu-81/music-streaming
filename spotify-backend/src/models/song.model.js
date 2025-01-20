import mongoose, { Schema } from "mongoose";

const songSchema = new Schema(
  {
    songName: {
      type: String,
      required: true,
    },

    artist: {
      type: String,
      required: true,
    },

    songCoverImage: {
      type: String,
    },

    songUrl: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const Song = mongoose.model("Song", songSchema);
