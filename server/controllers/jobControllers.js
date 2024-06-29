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
  try {
    const { title, description, budget, category } = req.body;

    if (!title || !description || !budget || !category) {
      return next(new HttpError("Please fill in all fields", 422));
    }

    if (description.length < 100) {
      return next(
        new HttpError("Description should be at least 100 characters", 422)
      );
    }

    const newJob = await Job.create({
      title,
      description,
      budget,
      client: req.user.id,
      category,
    });

    res
      .status(201)
      .json({ message: `New job created with title: ${newJob.title}` });
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

module.exports = { createJob, getJobs };
