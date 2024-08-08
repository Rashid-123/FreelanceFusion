const mongoose = require("mongoose");

const liveJobSchema = new mongoose.Schema(
  {
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    freelancer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
      index: true,
    },
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
    duration: {
      type: String,
      required: true,
      trim: true,
    },
    amount: {
      type: String,
      required: true,
    },
    milestones: {
      type: [
        {
          amount: {
            type: String,
            required: true,
          },
          confirmed: {
            type: Boolean,
            default: false,
          },
        },
      ],
      validate: {
        validator: function (v) {
          return v.length <= 3;
        },
        message: "You can have a maximum of 3 milestones",
      },
    },
    status: {
      type: String,
      enum: ["ongoing", "completed"],
      default: "ongoing",
    },
  },
  { timestamps: true }
);

const LiveJob = mongoose.model("LiveJob", liveJobSchema);

module.exports = LiveJob;
