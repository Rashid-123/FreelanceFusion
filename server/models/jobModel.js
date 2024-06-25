const mongoose = require("mongoose");
const jobCategories = [
  "Web Development",
  "Mobile App Development",
  "Graphic Design",
  "Digital Marketing",
  "Content Writing",
  "Data Entry",
  "Customer Support",
  "Sales",
  "Accounting",
  "Video Production",
  "Photography",
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
    categories: [
      {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        enum: jobCategories,
      },
    ],
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
