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
      required: false,
      trim: true,
    },
    salaryRange: {
      type: {
        aed: {
          type: {
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
                  const aed = this.salaryRange?.aed;
                  return !aed || !aed.min || value >= aed.min;
                },
                message:
                  "Max AED salary must be greater than or equal to min AED salary",
              },
            },
          },
          required: false,
        },
        usd: {
          type: {
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
                  // Safely check if usd and min exist before comparing
                  const usd = this.salaryRange?.usd;
                  return !usd || !usd.min || value >= usd.min;
                },
                message:
                  "Max USD salary must be greater than or equal to min USD salary",
              },
            },
          },
          required: false, // usd object itself is optional
        },
      },
      required: false, // Entire salaryRange object is optional
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
