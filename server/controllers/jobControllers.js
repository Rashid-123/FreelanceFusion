const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("../models/userModel");
const Job = require("../models/jobModel");
const Conversation = require("../models/conversationModel");
const nodemailer = require("nodemailer");
const { v4: uuid } = require("uuid");
const HttpError = require("../models/errorModel");
const mime = require("mime-types");
const {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

///// --------------- AWS S3 Setup ----------------------------

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

async function getObjectURL(key) {
  const command = new GetObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: key,
  });

  const url = await getSignedUrl(s3Client, command);
  return url;
}
///////////////////////////////////////////////////////////////////////

const createJob = async (req, res, next) => {
  console.log("in create job");
  try {
    console.log("1");

    const { title, description, budget, duration, category } = req.body;
    console.log("1");
    if (!title || !description || !budget || !category || !duration) {
      return next(new HttpError("Please fill in all fields", 422));
    }
    console.log("2");

    if (description.length < 100) {
      return next(
        new HttpError("Description should be at least 100 characters", 422)
      );
    }
    console.log("3");

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const newJob = await Job.create(
        [
          {
            title,
            description,
            budget,
            duration,
            client: req.user.id,
            category,
          },
        ],
        { session }
      );
      console.log("4");

      await User.findByIdAndUpdate(
        req.user.id,
        { $push: { projects: newJob[0]._id } },
        { session }
      );

      await session.commitTransaction();
      session.endSession();

      res
        .status(201)
        .json({ message: `New job created with title: ${newJob[0].title}` });
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  } catch (error) {
    console.error(error);
    return next(
      new HttpError("Creating job failed, please try again later", 500)
    );
  }
};
//////////////////////////////////////////////////////////////////////
//--------------------- Get All Jobs -------------------------------
const getJobs = async (req, res, next) => {
  try {
    const jobs = await Job.find().sort({ updated: -1 });
    res.status(200).json(jobs);
  } catch (error) {
    return next(new HttpError("Failed in fetching all the jobs", 500));
  }
};
//---------------------------- Get Job by Category -------------------------------

const category_job = async (req, res, next) => {
  try {
    const category = req.params.category.toLowerCase();

    const jobs = await Job.find({ category });

    res.status(200).send(jobs);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

///------------------------ GET JOBS BY ID ---------------------------
const get_job_details = async (req, res, next) => {
  try {
    const jobId = req.params.id;
    console.log("in jobs");
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    console.log(job);
    res.status(200).json(job);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
//------------------------ ADD PROPOSALS --------------------------------
const addProposal = async (req, res) => {
  const { freelancerId, proposalText, budget, status, duration } = req.body;
  const { id: jobId } = req.params;

  if (!freelancerId || !proposalText || !budget || !duration) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const job = await Job.findById(jobId);
    const user = await User.findById(freelancerId);

    const hasProposed = user.proposalsSent.some(
      (proposal) => proposal.job.toString() === jobId
    );

    if (hasProposed) {
      return res.status(400).json({
        message: "You have already submitted a proposal for this job.",
      });
    }

    const newProposal = {
      freelancer: freelancerId,
      proposalText,
      budget,
      duration,
      status: status || "pending",
    };

    const newProposal_send = {
      job: jobId,
      proposalText,
      budget,
      duration,
      status: status || "pending",
    };

    user.proposalsSent.push(newProposal_send);
    await user.save();

    job.proposals.push(newProposal);
    await job.save();

    res.status(201).json({ message: "Proposal added successfully", job });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createJob,
  getJobs,
  category_job,
  get_job_details,
  addProposal,
};
