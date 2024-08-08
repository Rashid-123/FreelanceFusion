const mongoose = require("mongoose");

// Proposal Sent Schema
const proposalSentSchema = new mongoose.Schema({
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job",
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

// Transaction History Schema
const transactionHistorySchema = new mongoose.Schema({
  transactionId: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    enum: ["credit", "debit"],
    required: true,
  },
  from: {
    type: String,
    required: true,
  },
  to: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

// User Schema
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
    },
    contact: {
      type: String,
    },
    avatar: {
      type: String,
    },
    bio: {
      type: String,
      trim: true,
    },
    skills: [
      {
        type: String,
        index: true,
      },
    ],
    projects: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job",
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
    proposalsSent: [proposalSentSchema],
    ongoingJob: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "LiveJob",
      },
    ],
    ongoingProjects: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "LiveJobs",
      },
    ],
    transactionHistory: [transactionHistorySchema],
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
