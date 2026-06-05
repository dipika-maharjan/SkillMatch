import User from "../models/User.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";
import crypto from "crypto";
import nodemailer from "nodemailer";

// REGISTER
const registerUser = async (req, res) => {
  try {
    const fullname = req.body?.fullname?.trim();
    const email = req.body?.email?.trim().toLowerCase();
    const password = req.body?.password;

    if (!fullname || !email || !password) {
      return res.status(400).json({
        message: "Please fill all fields",
      });
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        message: "Account already exists",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      fullname,
      email,
      password: hashedPassword,
    });

    if (user) {
      return res.status(201).json({
        _id: user._id,
        fullname: user.fullname,
        email: user.email,
        token: generateToken(user._id),
      });
    }

    return res.status(400).json({
      message: "Invalid user data",
    });
  } catch (error) {
    if (error?.code === 11000) {
      return res.status(400).json({
        message: "Account already exists",
      });
    }

    return res.status(500).json({
      message: error.message,
    });
  }
};

// LOGIN
const loginUser = async (req, res) => {
  try {
    const email = req.body?.email?.trim().toLowerCase();
    const password = req.body?.password;

    const user = await User.findOne({ email }).select("+password");

    if (user && (await bcrypt.compare(password, user.password))) {
      return res.json({
        _id: user._id,
        fullname: user.fullname,
        email: user.email,
        token: generateToken(user._id),
      });
    }

    return res.status(401).json({
      message: "Invalid email or password",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

// FORGOT PASSWORD
const forgotPassword = async (req, res) => {
  try {
    const user = await User.findOne({
      email: req.body?.email?.trim().toLowerCase(),
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const resetToken = crypto.randomBytes(20).toString("hex");

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

    await user.save();

    const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Password Reset",
      text: `Reset your password using this link: ${resetUrl}`,
    };

    await transporter.sendMail(mailOptions);

    return res.json({
      message: "Reset email sent",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

// RESET PASSWORD
const resetPassword = async (req, res) => {
  try {
    const user = await User.findOne({
      resetPasswordToken: req.params.token,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired token",
      });
    }

    const salt = await bcrypt.genSalt(10);

    user.password = await bcrypt.hash(req.body?.password, salt);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    return res.json({
      message: "Password reset successful",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

// PROFILE
const getProfile = async (req, res) => {
  return res.json(req.user);
};

export {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
  getProfile,
};
