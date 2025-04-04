// models/jobPost.js
import mongoose from "mongoose";
import { Company } from "./Company";
const jobPostSchema = new mongoose.Schema(
  {
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },

    jobTitle: {
      type: String,
      required: true,
      trim: true,
    },

    jobLocation: {
      type: String,
      required: true,
      trim: true,
    },

    salaryRange: {
      min: {
        type: Number,
        min: 0,
        required: false,
      },
      max: {
        type: Number,
        min: 0,
        required: false,
        validate: {
          validator: function (value) {
            return (
              !this.salaryRange ||
              !this.salaryRange.min ||
              value >= this.salaryRange.min
            );
          },
          message: "Max salary must be greater than or equal to min salary",
        },
      },
    },

    jobDescription: {
      type: String,
      required: true,
      trim: true,
    },

    keyResponsibilities: {
      type: [String],
      required: true,
    },

    requiredSkillsAndQualifications: {
      type: [String],
      required: true,
    },

    benefits: {
      type: [String],
      required: false,
    },

    status: {
      type: String,
      enum: ["Open", "Closed"],
      default: "Open",
    },

    applicationDeadline: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const JobPost =
  mongoose.models.JobPost || mongoose.model("JobPost", jobPostSchema);
