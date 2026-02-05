import { User as UserModel } from "../models/user.models.js";
import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import bcrypt, { hash } from "bcryptjs";
import jwt from "jsonwebtoken";
import { forgot_password_email_template } from "../templates/forgotPasswordMail.js";
import { sendEmail } from "../utils/emailSender.js";
import crypto from "crypto";

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    throw new ApiError(401, "all feilds are required");
  }

  const existingUser = await UserModel.findOne({ email });

  if (existingUser) {
    throw new ApiError(401, "user already registerd");
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const createdUser = await UserModel.create({
    name,
    email,
    password: hashPassword,
    role: role || "member",
    createdby: req.user?._id,
  });

  const registeredUser = await UserModel.findById(createdUser._id)
    .select("-password")
    .populate("createdby", "name email role ");

  // try {
  //   sendEmail({
  //     email: registeredUser.email,
  //     subject: "Welcome to NexManage!",
  //     message: `<p>Hi ${registeredUser.name},</p><p>Welcome to NexManage! Your account has been successfully created.</p><p>We're excited to have you on board.</p><p>Best regards,<br/>The NexManage Team</p>`,
  //   })
  // } catch (error) {
  //   throw new ApiError(500, "error while registering user");
  // }

  return res
    .status(200)
    .json(new ApiResponse(200, "user register succesfully", registeredUser));
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "all fields are required");
  }

  const existingUser = await UserModel.findOne({ email });

  if (!existingUser) {
    throw new ApiError(400, "user not found.. please register first");
  }

  const matchPassword = await bcrypt.compare(password, existingUser.password);

  if (!matchPassword) {
    throw new ApiError(400, "invalid credentilas");
  }

  let tokenPayload = {
    _id: existingUser._id,
    name: existingUser.name,
    email: existingUser.email,
    role: existingUser.role,
  };

  let userdDetailes = await UserModel.findOne({ email }).select("-password");

  let token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  const data = {
    userdDetailes,
    token,
  };

  return res
    .status(200)
    .cookie("token", token, { httponly: true, secure: true })
    .json(new ApiResponse(200, "user login succesfully", data));
});

const allUsers = asyncHandler(async (req, res) => {
  const users = await UserModel.find().select("-password");
  return res.status(200).json(new ApiResponse(200, "all users", users));
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
    throw new ApiError(400, "all fileds are required ");
  }

  if (!userId) {
    throw new ApiError(400, "usrId not found in the chnagePassword ");
  }

  const user = await UserModel.findById(userId);

  if (!user) {
    throw new ApiError(400, "user not found with this userId");
  }

  const isMatch = await bcrypt.compare(oldPassword, user.password);

  if (!isMatch) {
    throw new ApiError(400, "something went wrong.enter correct password");
  }

  const hashedNewPassword = await bcrypt.hash(newPassword, 10);

  const checkIsdifferent = await bcrypt.compare(newPassword, user.password);

  if (checkIsdifferent) {
    throw new ApiError(400, "new password must be different from old password");
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
    throw new ApiError(400, "all fileds are required");
  }

  const user = await UserModel.findOne({ email });

  if (!user) {
    throw new ApiError(
      400,
      "user not found with this email..enter registerd email",
    );
  }

  const resetToken = crypto.randomBytes(32).toString("hex");

  const hashToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  user.resetPasswordToken = hashToken;
  user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; //15 minutes expires time

  await user.save();

  const reset_url = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
  console.log("reset url is -----> ", reset_url);

  const message = forgot_password_email_template(reset_url);

  try {
    sendEmail({
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
      "SendGrid Email Error in forgot password ",
      error.response ? error.response.body : error,
    );
    user.resetPasswordExpire = undefined;
    user.resetPasswordToken = undefined;

    await user.save();
    throw new ApiError(500, "Email could not be send in forgot password");
  }
});

const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  if (!newPassword) {
    throw new ApiError(400, "all fields are required");
  }
  if (!token) {
    throw new ApiError(400, "token not found");
  }

  console.log("reset token is --------> ", token);

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  console.log("hased token -------> ", hashedToken);

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

const logoutUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .cookie("token", "", { httponly: true, secure: true })
    .json(new ApiResponse(200, "user logged out successfully"));
});

export {
  registerUser,
  loginUser,
  allUsers,
  changePassword,
  forgotPassword,
  resetPassword,
  logoutUser,
  updateUser,
  deleteUser,
};
