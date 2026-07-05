import User from "../models/User.js";
import Notification from "../models/Notification.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";
import crypto from "crypto";
import nodemailer from "nodemailer";

const buildPublicUser = (user) => ({
  _id: user._id,
  fullname: user.fullname,
  email: user.email,
  role: user.role,
  avatarUrl: user.avatarUrl || "",
  phone: user.phone || "",
  location: user.location || "",
  headline: user.headline || "",
  summary: user.summary || "",
  skills: user.skills || [],
  education: user.education || [],
  links: user.links || {},
  preferences: user.preferences || {},
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

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

    if (password.length < 8) {
      return res.status(400).json({
        message: "Password must be at least 8 characters",
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
        ...buildPublicUser(user),
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
    const emailPattern = /^\S+@\S+\.\S+$/;

    if (!email || !password) {
      return res.status(400).json({
        message: "Please fill all fields",
      });
    }

    if (!emailPattern.test(email)) {
      return res.status(400).json({
        message: "Enter a valid email address",
      });
    }

    const user = await User.findOne({ email }).select("+password");

    if (user && (await bcrypt.compare(password, user.password))) {
      return res.json({
        ...buildPublicUser(user),
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

// LOGOUT
const logoutUser = async (req, res) => {
  if (req.user) {
    req.user.tokenInvalidBefore = new Date();
    await req.user.save();
  }

  return res.json({
    message: "Logged out successfully",
  });
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

    if (!req.body?.password || req.body.password.length < 8) {
      return res.status(400).json({
        message: "Password must be at least 8 characters",
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
  return res.json(buildPublicUser(req.user));
};

// UPDATE PROFILE
const updateProfile = async (req, res) => {
  try {
    const {
      fullname,
      phone,
      location,
      headline,
      summary,
      skills,
      education,
      links,
    } = req.body || {};

    if (fullname !== undefined) {
      const trimmedName = String(fullname).trim();
      if (trimmedName.length < 2) {
        return res
          .status(400)
          .json({ message: "Full name must be at least 2 characters" });
      }
      req.user.fullname = trimmedName;
    }

    if (phone !== undefined) req.user.phone = String(phone).trim();
    if (location !== undefined) req.user.location = String(location).trim();
    if (headline !== undefined) req.user.headline = String(headline).trim();
    if (summary !== undefined) req.user.summary = String(summary).trim();

    if (skills !== undefined) {
      const skillsArray =
        typeof skills === "string"
          ? skills
              .split(",")
              .map((skill) => skill.trim())
              .filter(Boolean)
          : Array.isArray(skills)
            ? skills.map((skill) => String(skill).trim()).filter(Boolean)
            : [];
      req.user.skills = skillsArray;
    }

    if (education !== undefined) {
      const educationData =
        typeof education === "string" ? JSON.parse(education) : education;
      req.user.education = Array.isArray(educationData)
        ? educationData
        : req.user.education;
    }

    if (links !== undefined) {
      const linksData = typeof links === "string" ? JSON.parse(links) : links;
      req.user.links = {
        portfolio: String(linksData?.portfolio || "").trim(),
        linkedin: String(linksData?.linkedin || "").trim(),
        github: String(linksData?.github || "").trim(),
      };
    }

    await req.user.save();

    await Notification.create({
      user: req.user._id,
      type: "profile",
      title: "Profile Updated",
      message: "Your profile information was updated successfully.",
      actionUrl: "/settings/profile",
      metadata: { updatedAt: new Date().toISOString() },
    });

    console.log("Profile updated successfully for user:", req.user.email);

    return res.json({
      message: "Profile updated successfully",
      user: buildPublicUser(req.user),
    });
  } catch (error) {
    console.error("Profile update error:", error);
    return res.status(500).json({ message: error.message });
  }
};

// CHANGE PASSWORD
const changePassword = async (req, res) => {
  try {
    const currentPassword = req.body?.currentPassword;
    const newPassword = req.body?.newPassword;

    if (!currentPassword || !newPassword) {
      return res
        .status(400)
        .json({ message: "Current password and new password are required" });
    }

    if (String(newPassword).length < 8) {
      return res
        .status(400)
        .json({ message: "Password must be at least 8 characters" });
    }

    const userWithPassword = await User.findById(req.user._id).select(
      "+password",
    );
    if (!userWithPassword) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(
      currentPassword,
      userWithPassword.password,
    );
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    const salt = await bcrypt.genSalt(10);
    userWithPassword.password = await bcrypt.hash(newPassword, salt);
    userWithPassword.tokenInvalidBefore = new Date();
    await userWithPassword.save();

    return res.json({ message: "Password updated successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// GET SETTINGS
const getSettings = async (req, res) => {
  return res.json({
    preferences: req.user.preferences || {},
    account: buildPublicUser(req.user),
  });
};

// UPDATE SETTINGS
const updateSettings = async (req, res) => {
  try {
    const { preferences = {}, account = {} } = req.body || {};

    if (preferences && typeof preferences === "object") {
      req.user.preferences = {
        ...req.user.preferences,
        ...preferences,
      };
    }

    if (account && typeof account === "object") {
      if (account.fullname !== undefined)
        req.user.fullname = String(account.fullname).trim();
      if (account.phone !== undefined)
        req.user.phone = String(account.phone).trim();
      if (account.location !== undefined)
        req.user.location = String(account.location).trim();
      if (account.headline !== undefined)
        req.user.headline = String(account.headline).trim();
      if (account.summary !== undefined)
        req.user.summary = String(account.summary).trim();
    }

    await req.user.save();

    await Notification.create({
      user: req.user._id,
      type: "settings",
      title: "Settings Updated",
      message: "Your notification and account settings were updated.",
      actionUrl: "/settings",
      metadata: { updatedAt: new Date().toISOString() },
    });

    return res.json({
      message: "Settings updated successfully",
      settings: {
        preferences: req.user.preferences,
        account: buildPublicUser(req.user),
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export {
  registerUser,
  loginUser,
  logoutUser,
  forgotPassword,
  resetPassword,
  getProfile,
  updateProfile,
  changePassword,
  getSettings,
  updateSettings,
};
