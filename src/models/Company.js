// models/company.js
import mongoose from "mongoose";

const companySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  website: {
    type: String,
    trim: true,
    match: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
  },
  foundedYear: {
    type: Number,
    min: 1800,
    max: new Date().getFullYear(),
  },
  contactEmail: {
    type: String,
    trim: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  contactPhone: {
    type: String,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

companySchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

export const Company =
  mongoose.models.Company || mongoose.model("Company", companySchema);
