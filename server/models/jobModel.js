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

const proposalSchema = new mongoose.Schema({
  freelancer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  freelancer_proposalSentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User.proposalsSent",
  },
  proposalText: {
    type: String,
    trim: true,
  },
  budget: {
    type: Number,
  },
  duration: {
    type: String,
  },
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

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
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      enum: jobCategories,
    },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    duration: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["open", "in progress", "completed", "cancelled"],
      default: "open",
    },
    proposals: [proposalSchema],
  },
  { timestamps: true }
);

const Job = mongoose.model("Job", jobSchema);

module.exports = Job;
