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

const registerUser = asyncHandler(async (req, res) => {
  const { name, username, email, password, confirmPassword, profilePicture } =
    req.body;

  if (password !== confirmPassword) {
    throw new ApiError("Passwords do not match", 400);
  }

  // Validate the user input
  const validateUser = registerUserSchema.parse({
    name,
    username,
    email,
    password,
    confirmPassword,
    profilePicture,
  });

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError("Username or email already exists", 400);
  }

  const profilePictureLocalPath = req.files?.profilePicture[0]?.path;

  if (!profilePictureLocalPath) {
    throw new ApiError("Profile picture is required", 400);
  }

  const profilePictureUrl = await uploadImage(profilePictureLocalPath);

  if (!profilePictureUrl.url) {
    throw new ApiError("Failed uploading the profile picture", 401);
  }

  const newUser = await User.create({
    name,
    username,
    email,
    password,
    profilePicture: profilePictureUrl.url,
    isVerified: false,
  });

  const createdUser = { ...newUser, password: "", refreshToken: "" };

  //   const createdUser = await User.findById(user._id).select(
  //     "-password -refreshToken"
  //   );

  if (!createdUser) {
    throw new ApiError("Failed to create user", 500);
  }

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
    throw new ApiError("Invalid login credentials", 404);
  }

  // Check if password exists and is correct
  if (!user.password || !(await user.isPasswordCorrect(password))) {
    throw new ApiError("Invalid login credentials", 401);
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

export { loginUser, registerUser, logoutUser };
