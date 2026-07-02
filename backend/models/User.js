import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },

    password: {
      type: String,
      required: true,
      select: false,
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    avatarUrl: {
      type: String,
      default: "",
    },

    phone: {
      type: String,
      default: "",
      trim: true,
    },

    location: {
      type: String,
      default: "",
      trim: true,
    },

    headline: {
      type: String,
      default: "",
      trim: true,
    },

    summary: {
      type: String,
      default: "",
    },

    skills: {
      type: [String],
      default: [],
    },

    education: {
      type: [
        {
          school: { type: String, default: "" },
          degree: { type: String, default: "" },
          startYear: { type: String, default: "" },
          endYear: { type: String, default: "" },
        },
      ],
      default: [],
    },

    links: {
      portfolio: { type: String, default: "" },
      linkedin: { type: String, default: "" },
      github: { type: String, default: "" },
    },

    preferences: {
      jobAlerts: { type: Boolean, default: true },
      emailNotifications: { type: Boolean, default: true },
      marketingEmails: { type: Boolean, default: false },
      profileVisibility: { type: String, enum: ["public", "private"], default: "public" },
    },

    tokenInvalidBefore: {
      type: Date,
      default: null,
    },

    resetPasswordToken: {
      type: String,
    },

    resetPasswordExpire: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;
