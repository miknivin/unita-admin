import mongoose from "mongoose";

const applicantSchema = new mongoose.Schema(
  {
    jobPost: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "JobPost",
      required: true,
    },

    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    resume: {
      url: {
        type: String,
        required: true,
      },
      public_id: {
        type: String,
        required: false,
      },
    },

    coverLetter: {
      type: String,
      required: false,
      trim: true,
    },

    status: {
      type: String,
      enum: ["Pending", "Reviewed", "Accepted", "Rejected"],
      default: "Pending",
    },

    appliedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export const Applicant =
  mongoose.models.Applicant || mongoose.model("Applicant", applicantSchema);
