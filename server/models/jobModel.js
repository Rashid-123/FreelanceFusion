const mongoose = require("mongoose");

const jobCategories = [
  "web development",
  "mobile app development",
  "graphic design",
  "digital marketing",
  "content writing",
  "data entry",
  "customer support",
  "sales",
  "accounting",
  "video production",
  "photography",
];

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    budget: {
      type: Number,
      required: true,
    },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    category: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      enum: jobCategories,
    },
    status: {
      type: String,
      enum: ["open", "in progress", "completed", "cancelled"],
      default: "open",
    },
    proposals: [
      {
        freelancer: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        proposalText: {
          type: String,
          trim: true,
        },
        budget: {
          type: Number,
        },
        status: {
          type: String,
          enum: ["pending", "accepted", "rejected"],
          default: "pending",
        },
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Job = mongoose.model("Job", jobSchema);

module.exports = Job;
