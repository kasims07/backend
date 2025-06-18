import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { Subscription } from "../models/subscription.model.js";
import { uploadOnCloudinary } from "../utils/cloudnary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import e from "express";

const genrateRefreshTokenAndAccessToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.ganrateAccessToken();
    const refreshToken = user.ganrateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (e) {
    throw new ApiError(500, "Something went wrong while genrating token");
  }
};

const registerUser = asyncHandler(async (req, res) => {
  // get user details from frontend
  // validation - not empty
  // check if user already exists: username, email
  // check for images, check for avatar
  // upload them to cloudinary, avatar
  // create user object - create entry in db
  // remove password and refresh token field from response
  // check for user creation
  // return res

  const { fullName, email, username, password } = req.body;
  //console.log("email: ", email);

  if (
    [fullName, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "User with email or username already exists");
  }
  //console.log(req.files);

  // const avatarLocalPath = req.files?.avatar[0]?.path;
  // //const coverImageLocalPath = req.files?.coverImage[0]?.path;

  // let coverImageLocalPath;
  // if (
  //   req.files &&
  //   Array.isArray(req.files.coverImage) &&
  //   req.files.coverImage.length > 0
  // ) {
  //   coverImageLocalPath = req.files.coverImage[0].path;
  // }

  // if (!avatarLocalPath) {
  //   throw new ApiError(400, "Avatar file is required");
  // }

  // const avatar = await uploadOnCloudinary(avatarLocalPath);
  // const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  // if (!avatar) {
  //   throw new ApiError(400, "Avatar file is required");
  // }

  const user = await User.create({
    fullName,
    // avatar: avatar.url,
    // coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered Successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if (!username && !email) {
    throw new ApiError(400, "Please enter email or username");
  }

  const user = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (!user) {
    throw new ApiError(401, "User not exist in system");
  }

  const passwordMatch = await user.isPasswordCorrect(password);

  if (!passwordMatch) {
    throw new ApiError(400, "Invalid password");
  }

  const { accessToken, refreshToken } = await genrateRefreshTokenAndAccessToken(
    user._id
  );

  const loginUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loginUser,
          accessToken,
          refreshToken,
        },
        "user login sucessfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User Logout Sucessfully"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;
  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized request");
  }
  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.ACCESS_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken?._id);

    if (!user) {
      throw new ApiError(401, "Invalid refresh token");
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh token is expired");
    }

    const options = {
      httpOnly: true,
      secure: true,
    };

    const { accessToken, newrefreshToken } =
      await genrateRefreshTokenAndAccessToken(user?._id);

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newrefreshToken, options)
      .json(
        new ApiResponse(
          200,
          {
            accessToken,
            refreshToken: newrefreshToken,
          },
          "Accesstoken refresh"
        )
      );
  } catch (e) {
    throw new ApiError(401, e?.message || "Invalid refresh token");
  }
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const user = await User.findById(req.user?._id);

  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

  if (!isPasswordCorrect) {
    throw ApiError(400, "Invalid Old Password");
  }

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  return res.status(200).json(new ApiResponse(200, req.user, "Success"));
});

const updateUser = asyncHandler(async (req, res) => {
  const { fullName, email } = req.body;

  if (!fullName || !email) {
    throw ApiError(400, "All filed are required");
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        fullName,
        email,
      },
    },
    {
      new: true,
    }
  ).select("-password");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Update Successfully"));
});

const subscribeChannel = asyncHandler(async (req, res) => {
  const { channelId } = req.body;

  if (!channelId) {
    throw new ApiError(400, "Channel ID is required");
  }

  const channel = await User.findById(channelId);
  if (!channel) {
    throw new ApiError(404, "Channel not found");
  }
  const isAlreadySubscribed = await Subscription.findOne({
    subscriber: req.user?._id,
    channel: channelId,
  });
  if (isAlreadySubscribed) {
    throw new ApiError(400, "You are already subscribed to this channel");
  }
  const subscription = await Subscription.create({
    subscriber: req.user?._id,
    channel: channelId,
  }); 
  if (!subscription) {
    throw new ApiError(500, "Something went wrong while subscribing to channel");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, subscription, "Subscribed to channel successfully"));
});

const channel = asyncHandler(async (req, res) => {
  const { channelName } = req.body;
  if (!channelName?.trim()) {
    throw new ApiError(400, "Channel name is required");
  }
  const channel = await User.aggregate(
    [
  {
    $match: {
      username: channelName.toLowerCase()
    }
  },
  {
    $lookup: {
      from: "subscriptions",
      localField: "_id",
      foreignField: "channel",
      as: "subscribers"
    }
  },
  {
    $lookup: {
      from: "subscriptions",
      localField: "_id",
      foreignField: "subscriber",
      as: "subscriptions"
    }
  },
  {
    $addFields:
      {
        subscriberCount: {
          $size: "$subscribers"
        },
        subscriptionCount: {
          $size: "$subscriptions"
        },
        isSubscribed: {
          $cond: {
            if: {
              $in: [
                req.user?._id,
                "$subscribers.subscriber"
              ]
            },
            then: true,
            else: false
          }
        }
      }
  },
  {
            $project: {
                fullName: 1,
                username: 1,
                subscriberCount: 1,
                subscriptionCount: 1,
                isSubscribed: 1,
                // avatar: 1,
                // coverImage: 1,
                email: 1

            }
        }
]
);

  if (!channel?.length) {
    throw new ApiError(404, "Channel not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, channel[0], "Channel details fetched successfully"));
});

export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateUser,
  subscribeChannel,
  channel
};
