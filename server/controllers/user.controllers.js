import { User as UserModel } from "../models/user.models.js";
import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { forgot_password_email_template } from "../templates/forgotPasswordMail.js";
import sendEmail from "../utils/sendMail.js";
import crypto from "crypto";
import { invite_member_email_template } from "../templates/inviteMemberMail.js";

const inviteUser = asyncHandler(async (req, res) => {
  const { name, email, role, isTempMember } = req.body;

  if (!name || !email) {
    throw new ApiError(400, "Name and email are required");
  }

  const existingUser = await UserModel.findOne({ email });

  if (existingUser && !existingUser.isInvited) {
    throw new ApiError(400, "User already registered with this email");
  }

  const rawToken = crypto.randomBytes(32).toString("hex");

  const hashedToken = crypto
    .createHash("sha256")
    .update(rawToken)
    .digest("hex");

  if (existingUser && existingUser.isInvited) {
    existingUser.name = name;
    existingUser.role = role || "member";
    existingUser.isTempMember = isTempMember || false;
    existingUser.inviteToken = hashedToken;
    existingUser.inviteTokenExpire = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
    existingUser.isInvited = true;
    existingUser.password = undefined;
    existingUser.createdby = req.user?._id;

    await existingUser.save();

    const setPasswordLink = `${process.env.CLIENT_URL}/set-password/${rawToken}`;
    const message = invite_member_email_template(name, setPasswordLink);

    try {
      await sendEmail({
        email,
        subject: "You are invited to NexManage",
        message,
      });
    } catch (error) {
      console.error("Email sending failed:", error);
      existingUser.inviteToken = undefined;
      existingUser.inviteTokenExpire = undefined;
      await existingUser.save();
      throw new ApiError(500, "Failed to send invite email. Please try again.");
    }

    const updatedUser = await UserModel.findById(existingUser._id)
      .select("-password -inviteToken -inviteTokenExpire")
      .populate("createdby", "name email role");

    return res
      .status(200)
      .json(
        new ApiResponse(200, "Invitation resent successfully", updatedUser),
      );
  }

  const createdUser = await UserModel.create({
    name,
    email,
    role: role || "member",
    isTempMember: isTempMember || false,
    isInvited: true,
    inviteToken: hashedToken,
    inviteTokenExpire: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
    createdby: req.user?._id,
  });

  const setPasswordLink = `${process.env.CLIENT_URL}/set-password/${rawToken}`;
  const message = invite_member_email_template(name, setPasswordLink);

  try {
    await sendEmail({
      email,
      subject: "You are invited to NexManage",
      message,
    });
  } catch (error) {
    console.error("Email sending failed:", error);
    await UserModel.findByIdAndDelete(createdUser._id);
    throw new ApiError(500, "Failed to send invite email. Please try again.");
  }

  const registeredUser = await UserModel.findById(createdUser._id)
    .select("-password -inviteToken -inviteTokenExpire")
    .populate("createdby", "name email role");

  return res
    .status(201)
    .json(new ApiResponse(201, "Invitation sent successfully", registeredUser));
});

const setPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  if (!password) {
    throw new ApiError(400, "Password is required");
  }

  if (password.length < 6) {
    throw new ApiError(400, "Password must be at least 6 characters long");
  }

  if (!token) {
    throw new ApiError(400, "Token is required");
  }

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await UserModel.findOne({
    inviteToken: hashedToken,
    inviteTokenExpire: { $gt: Date.now() },
  });

  if (!user) {
    throw new ApiError(400, "Invalid or expired invite link");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  user.password = hashedPassword;
  user.inviteToken = undefined;
  user.inviteTokenExpire = undefined;
  user.isInvited = false;

  await user.save();

  return res
    .status(200)
    .json(
      new ApiResponse(200, "Password set successfully. You can now log in."),
    );
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "All fields are required");
  }

  const existingUser = await UserModel.findOne({ email });

  if (!existingUser) {
    throw new ApiError(400, "User not found. Please register first.");
  }

  if (existingUser.isInvited) {
    throw new ApiError(
      403,
      "Please set your password using the invitation link sent to your email before logging in.",
    );
  }

  if (!existingUser.password) {
    throw new ApiError(
      403,
      "No password set for this account. Please use the invite link to set your password.",
    );
  }

  const matchPassword = await bcrypt.compare(password, existingUser.password);

  if (!matchPassword) {
    throw new ApiError(400, "Invalid credentials");
  }

  let tokenPayload = {
    _id: existingUser._id,
    name: existingUser.name,
    email: existingUser.email,
    role: existingUser.role,
    isTempMember: existingUser.isTempMember,
  };

  let userdDetailes = await UserModel.findOne({ email }).select("-password");

  let jwtToken = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  const data = {
    userdDetailes,
    token: jwtToken,
  };

  return res
    .status(200)
    .cookie("token", jwtToken, { httpOnly: true, secure: false })
    .json(new ApiResponse(200, "User login successfully", data));
});

const allUsers = asyncHandler(async (req, res) => {
  const currentUserId = req.user._id;
  const currentUserRole = req.user.role;

  let filter = {
    _id: { $ne: currentUserId },
    isTempMember: { $ne: true },
  };

  if (currentUserRole === "admin") {
    filter.role = "member";
  }

  if (currentUserRole === "super_admin") {
    filter.role = { $in: ["admin", "member"] };
  }

  const users = await UserModel.find(filter).select(
    "-password -inviteToken -inviteTokenExpire",
  );

  return res
    .status(200)
    .json(new ApiResponse(200, "All users fetched successfully", users));
});

const updateUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { name, email, role } = req.body;

  if (!userId) {
    throw new ApiError(400, "userId is required");
  }

  const user = await UserModel.findById(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (email && email !== user.email) {
    const emailExists = await UserModel.findOne({ email });
    if (emailExists) {
      throw new ApiError(400, "Email already in use");
    }
  }

  user.name = name ?? user.name;
  user.email = email ?? user.email;
  user.role = role ?? user.role;

  await user.save();

  const updatedUser = await UserModel.findById(user._id).select("-password");

  return res
    .status(200)
    .json(new ApiResponse(200, "User updated successfully", updatedUser));
});

const deleteUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    throw new ApiError(400, "userId is required");
  }

  if (req.user._id.toString() === userId) {
    throw new ApiError(400, "You cannot delete your own account");
  }

  const user = await UserModel.findById(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  await user.deleteOne();

  return res
    .status(200)
    .json(new ApiResponse(200, "User deleted successfully"));
});

const changePassword = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    throw new ApiError(400, "All fields are required");
  }

  if (!userId) {
    throw new ApiError(400, "userId not found in changePassword");
  }

  const user = await UserModel.findById(userId);

  if (!user) {
    throw new ApiError(400, "User not found with this userId");
  }

  const isMatch = await bcrypt.compare(oldPassword, user.password);

  if (!isMatch) {
    throw new ApiError(400, "Enter correct current password");
  }

  const hashedNewPassword = await bcrypt.hash(newPassword, 10);

  const checkIsDifferent = await bcrypt.compare(newPassword, user.password);

  if (checkIsDifferent) {
    throw new ApiError(400, "New password must be different from old password");
  }

  user.password = hashedNewPassword;
  await user.save();

  return res
    .status(200)
    .json(new ApiResponse(200, "Password changed successfully"));
});

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    throw new ApiError(400, "Email is required");
  }

  const user = await UserModel.findOne({ email });

  if (!user) {
    throw new ApiError(
      400,
      "User not found with this email. Enter registered email.",
    );
  }

  if (user.isInvited) {
    throw new ApiError(
      400,
      "This account is pending invitation. Please use the invite link to set your password first.",
    );
  }

  const resetToken = crypto.randomBytes(32).toString("hex");

  const hashToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  user.resetPasswordToken = hashToken;
  user.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

  await user.save();

  const reset_url = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

  const message = forgot_password_email_template(reset_url);

  try {
    await sendEmail({
      email: user.email,
      subject: "NexManage Password Reset",
      message: message,
    });
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          "Email sent successfully at your registered email address",
        ),
      );
  } catch (error) {
    console.error(
      "SendGrid Email Error in forgot password:",
      error.response ? error.response.body : error,
    );
    user.resetPasswordExpire = undefined;
    user.resetPasswordToken = undefined;

    await user.save();
    throw new ApiError(500, "Email could not be sent");
  }
});

const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  if (!newPassword) {
    throw new ApiError(400, "All fields are required");
  }
  if (!token) {
    throw new ApiError(400, "Token not found");
  }

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await UserModel.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    throw new ApiError(400, "Invalid or expired token");
  }

  const hashedNewPassword = await bcrypt.hash(newPassword, 10);

  user.password = hashedNewPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();
  return res
    .status(200)
    .json(new ApiResponse(200, "Password reset successfully"));
});

const getMyProfile = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const user = await UserModel.findById(userId).select("-password");
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, "User profile fetched successfully", user));
});

const logoutUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .cookie("token", "", { httponly: true, secure: true })
    .json(new ApiResponse(200, "User logged out successfully"));
});

export {
  inviteUser,
  setPassword,
  loginUser,
  allUsers,
  changePassword,
  forgotPassword,
  resetPassword,
  logoutUser,
  updateUser,
  deleteUser,
  getMyProfile,
};