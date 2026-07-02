import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    fileName: {
      type: String,
      required: true,
      trim: true,
    },
    fileUrl: {
      type: String,
      required: true,
      trim: true,
    },
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
    rawText: {
      type: String,
      default: "",
    },
    skills: [
      {
        type: String,
        lowercase: true,
        trim: true,
      },
    ],
    matchScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    analysis: {
      matchedSkills: {
        count: { type: Number, default: 0 },
        percentage: { type: Number, default: 0 },
        list: [String],
      },
      missingSkills: {
        count: { type: Number, default: 0 },
        percentage: { type: Number, default: 0 },
        list: [String],
      },
      skillBreakdown: [
        {
          skill: String,
          proficiency: {
            type: String,
            enum: ["Strong", "Average", "Weak"],
          },
          percentage: Number,
        },
      ],
      suggestions: [String],
      areasToImprove: [
        {
          area: String,
          severity: {
            type: String,
            enum: ["LOW", "MEDIUM", "HIGH", "NOT FOUND"],
          },
        },
      ],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

const Resume = mongoose.model("Resume", resumeSchema);

export default Resume;
