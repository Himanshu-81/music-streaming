import { User } from "../models/user.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadImage } from "../utils/cloudinary.js";
import generateTheAccessAndRefreshToken from "../utils/generateAccessRefreshToken.js";
import {
  loginUserSchema,
  registerUserSchema,
} from "../validations/user.validations.js";
import { sendEmail } from "../helper/sendEmail.js";
import { generateVerificationLinkToken } from "../utils/generateVerificationLinkToken.js";

const registerUser = asyncHandler(async (req, res, next) => {
  const { name, username, email, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    throw new ApiError("Passwords do not match", 400);
  }

  // Validate the user input
  registerUserSchema.parse({
    name,
    username,
    email,
    password,
    confirmPassword,
  });

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(400, "Username or email already exists");
  }

  const profilePictureLocalPath = req.file?.path;

  if (!profilePictureLocalPath) {
    throw new ApiError(400, "Profile picture is required");
  }

  const profilePictureUrl = await uploadImage(profilePictureLocalPath);

  if (!profilePictureUrl) {
    throw new ApiError(401, "Failed uploading the profile picture");
  }

  // Generate the verfication token for the user email verify
  const { verificationToken, verificationTokenExpiry } =
    generateVerificationLinkToken();

  const newUser = await User.create({
    name,
    username,
    email,
    password,
    profilePicture: profilePictureUrl,
    isVerified: false,
    verificationToken,
    verificationTokenExpiry,
  });

  const createdUser = { ...newUser, password: "", refreshToken: "" };

  if (!createdUser) {
    throw new ApiError(500, "Failed to create user");
  }

  sendEmail(
    email,
    "Welcome To Spotify",
    name,
    (verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}&email=${email}`)
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        createdUser,
        "User registered successfully please login!"
      )
    );
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validate user input using Zod (no need for an extra check)
  loginUserSchema.parse({ email, password });

  // Find user by email
  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, "Invalid login credentials");
  }

  // Check if password exists and is correct
  if (!user.password || !(await user.isPasswordCorrect(password))) {
    throw new ApiError(401, "Invalid login credentials");
  }

  // Generate JWT tokens
  const { accessToken, refreshToken } = await generateTheAccessAndRefreshToken(
    user._id
  );

  // Get user data without password & refreshToken
  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  // Cookie options
  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "None",
  };

  // Send response
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged in successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: "",
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "None",
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out"));
});

const verifyEmail = asyncHandler(async (req, res) => {
  const { email, token } = req.query;

  if (!email || !token) {
    throw new ApiError(403, "Invalid verification link");
  }

  const user = await User.findOne({
    email,
    verificationToken: token,
    verificationTokenExpiry: { $gt: Date.now() },
  });

  if (!user) {
    throw new ApiError(403, "Invalid verification link");
  }

  user.isVerified = true;
  user.verificationToken = undefined;
  user.verificationTokenExpiry = undefined;

  await user.save({ validateBeforeSave: false });
});

export { loginUser, registerUser, logoutUser, verifyEmail };
