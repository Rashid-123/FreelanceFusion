const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("../models/userModel");
const LiveJobs = require("../models/LiveJobes");
const nodemailer = require("nodemailer");
const { v4: uuid } = require("uuid");
const HttpError = require("../models/errorModel");
const mime = require("mime-types");
//
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
//
const {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
  DeleteObjectCommand,
  RestoreRequestFilterSensitiveLog,
} = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

//
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
/////////////////////////////////////////////////////////////////////////
//--------------------------- Send OTP -----------------------------------

const otpStorage = {};
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SENDER_EMAIL,
    pass: process.env.MAIL_PASS,
  },
});

//////////////////////////////////////////////////////////////////////
// ---------------------- OTP for Register --------------------------------
// post(users/)
const OTP_for_Register = async (req, res, next) => {
  try {
    const email = req.body.email?.trim().toLowerCase();
    if (!email) {
      return next(new HttpError("Please Enter an Email"));
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return next(new HttpError("Invalid email address", 422));
    }

    const emailExists = await User.findOne({ email: email });
    if (emailExists) {
      return next(new HttpError("Email already exists.", 422));
    }

    const otp = Math.floor(100000 + Math.random() * 900000);
    otpStorage[email] = otp;

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "OTP verification for Frelance",
      html: `<div style="background-color: #f0f0f0; padding: 20px; margin: auto ;">
        <h1 style="color: #333;">OTP from <strong>Freelance</strong></h1>
        <p style="font-size: 18px;">Your OTP code is <strong style="color: blue: ">${otp}</strong>.</p>
        <p style="font-size: 14px; color: #888;">This OTP is valid for a limited time.</p>
      </div>`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).send(error.toString());
      }
      res.status(200).send("OTP sent");
    });
  } catch (error) {
    return next(new HttpError("Failed to send OTP", 500));
  }
};

//////////////////////////////////////////////////////////////////////////
//------------------ Register User ---------------------------------
const registerUser = async (req, res, next) => {
  console.log("register user is running");
  try {
    // const { name, email, password, password2, otp } = req.body;
    // if (!name || !email || !password || !otp) {
    //   return next(new HttpError("Fill in all fields", 422));
    // }
    const { name, email, password, password2 } = req.body;
    if (!name || !email || !password || !password2) {
      return next(new HttpError("Fill in all fields", 422));
    }

    const newEmail = email.trim().toLowerCase();

    // Email validation regex pattern
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
      return next(new HttpError("Invalid email address", 422));
    }

    const emailExists = await User.findOne({ email: newEmail });
    console.log("third");
    if (emailExists) {
      return next(new HttpError("Email already exists.", 422));
    }
    if (password.trim().length < 6) {
      return next(new HttpError("Password should be at least 6 characters."));
    }
    if (password !== password2) {
      return next(new HttpError("Passwords do not match.", 422));
    }

    // const storedOTP = otpStorage[newEmail];
    // if (!storedOTP || parseInt(otp) !== storedOTP) {
    //   return next(new HttpError("Invalid OTP.", 422));
    // }

    // delete otpStorage[newEmail];

    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      name,
      email: newEmail,
      password: hashedPass,
    });

    res.status(201).json(`New user ${newUser.email} registered`);
  } catch (error) {
    return next(new HttpError("User registration failed.", 422));
  }
};

///////////////////////////////////////////////////////////////////////
//------------------------- Login User ----------------------------------
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new HttpError("fill in all fields", 422));
    }

    const newEmail = email.toLowerCase();
    const user = await User.findOne({ email: newEmail });

    if (!user) {
      return next(new HttpError("Invalid credentials", 422));
    }
    const comparePass = await bcrypt.compare(password, user.password);

    if (!comparePass) {
      return next(new HttpError("Invalid credentials", 422));
    }

    const { _id: id, name } = user;
    console.log("second");

    const token = jwt.sign({ id, name }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(200).json({ token, id, name });
  } catch (error) {
    return next(
      new HttpError("Login Failed , please check your credentials", 422)
    );
  }
};
////////////////////////////////////////////////////////////////////////////
//----------------------- CHANGE AVATAR ---------------------------------------
const sharp = require("sharp");
const Job = require("../models/jobModel");

const changeAvatar = async (req, res, next) => {
  try {
    if (!req.files || !req.files.avatar) {
      return next(new HttpError("Please choose an image", 422));
    }

    const { avatar } = req.files;
    //
    let compressedImageBuffer;
    if (avatar.size > 1000000) {
      compressedImageBuffer = await sharp(avatar.data)
        .resize(1024, 1024, { fit: "inside" })
        .jpeg({ quality: 70 })
        .toBuffer();
    } else {
      compressedImageBuffer = avatar.data;
    }
    //
    const user = await User.findById(req.user.id);
    if (!user) {
      return next(new HttpError("User not found", 404));
    }
    //
    if (user.avatar) {
      const deleteParams = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: user.avatar,
      };

      try {
        await s3Client.send(new DeleteObjectCommand(deleteParams));
      } catch (err) {
        console.error("Error deleting old avatar from S3:", err);
        throw new HttpError("Failed to delete old avatar from S3", 500);
      }
    }
    //
    let fileName = avatar.name;
    let splittedFilename = fileName.split(".");
    let newFilename =
      splittedFilename[0] +
      uuid() +
      "." +
      splittedFilename[splittedFilename.length - 1];
    //
    const uploadParams = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: `avatar/${newFilename}`,
      Body: compressedImageBuffer,
      ContentType: mime.lookup(avatar.name) || "application/octet-stream",
      ACL: "private",
    };

    try {
      await s3Client.send(new PutObjectCommand(uploadParams));
    } catch (err) {
      console.error("Error uploading avatar to S3:", err);
      throw new HttpError("Error uploading avatar to S3", 500);
    }
    //

    const updatedAvatar = await User.findByIdAndUpdate(
      req.user.id,
      { avatar: `avatar/${newFilename}` },
      { new: true }
    );

    if (!updatedAvatar) {
      return next(new HttpError("Avatar couldn't be changed", 422));
    }

    const avatarURL = await getObjectURL(`avatar/${newFilename}`);
    res.status(200).json({ avatarURL });
  } catch (error) {
    console.error("Error changing avatar:", error);
    return next(new HttpError(error.message, 500));
  }
};

//////////////////////////////////////////////////////////////////////////////
//----------------------- GET USER ---------------------------------------
const getUser = async (req, res, next) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId).select(
      "name skills avatar contact bio"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let avatarURL;
    if (user.avatar) {
      avatarURL = await getObjectURL(user.avatar);
    }

    const userResponse = {
      _id: user._id,
      name: user.name,
      skills: user.skills,
      avatarURL: avatarURL || null,
      contact: user.contact,
      bio: user.bio,
    };

    res.json(userResponse);
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(500).json({ message: "Server error" });
  }
};
//////////////////////////////////////////////////////////////////////////////////
//-------------------- Update User Details --------------------------------------
const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, contact, skills, bio } = req.body;

  console.log("Update request for user ID:", id);
  console.log("Request body:", req.body);

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (name) {
      console.log("Updating name:", name);
      user.name = name;
    }
    if (contact) {
      console.log("Updating contact:", contact);
      user.contact = contact;
    }
    if (skills) {
      const skills = JSON.parse(req.body.skills);
      user.skills = skills;
    }
    if (bio) {
      console.log("Updating bio:", bio);
      user.bio = bio;
    }

    await user.save();

    console.log("User details updated successfully:", user);

    res
      .status(200)
      .json({ message: "User details updated successfully", user });
  } catch (error) {
    res.status(500).json({ message: "server error" });
  }
};
///----------- FETCH ALL SEND PROPOSALS -----------------------------------
const getUserProposalsWithJobData = async (req, res) => {
  try {
    const userId = req.params.userId;

    const user = await User.findById(userId).populate({
      path: "proposalsSent.job",
      model: "Job",
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      userId: user._id,
      name: user.name,
      email: user.email,
      proposalsSent: user.proposalsSent,
    });
  } catch (error) {
    console.error("Error fetching user proposals with job data:", error);
    res.status(500).json({ message: "Server error" });
  }
};
///////////////////////////// USER PROJECTS //////////////////////////////////
//  Protected

const userProjects = async (req, res, next) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId).populate("projects");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user.projects);
  } catch (error) {
    console.error("Error fetching user's projects:", error);
    res.status(500).json({ message: "Server error" });
  }
};
//////////////////////// UserBids //////////////////////////////////////////
const userBids = async (req, res, next) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId).populate("proposalsSent");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user.proposalsSent);
  } catch (error) {
    console.error("Error fetching user's proposals:", error);
    res.status(500).json({ message: "Server error" });
  }
};

//////////////////////////////////////////////////////////////////////////////////
const checkout = async (req, res, next) => {
  const { clientId, jobId, jobTitle, jobDescription, duration, proposal } =
    req.body;

  if (!Number.isInteger(proposal.budget) || proposal.budget <= 0) {
    return res.status(400).json({ error: "Invalid amount" });
  }

  if (!mongoose.Types.ObjectId.isValid(jobId)) {
    return res.status(400).json({ error: "Invalid Job ID" });
  }
  if (!mongoose.Types.ObjectId.isValid(clientId)) {
    return res.status(400).json({ error: "Invalid Client ID" });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const stripeSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: jobTitle },
            unit_amount: proposal.budget * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `http://localhost:5173/ongoingProjects/${clientId}`,
      cancel_url: "http://localhost:5173/cancel",
    });

    const transaction = {
      transactionId: stripeSession.id,
      amount: proposal.budget,
      type: "debit",
      from: clientId,
      to: "Platform",
      date: new Date(),
    };

    await User.findByIdAndUpdate(
      clientId,
      { $push: { transactionHistory: transaction } },
      { new: true, useFindAndModify: false, session }
    );

    const liveJob = new LiveJobs({
      client: clientId,
      freelancer: proposal.freelancer,
      title: jobTitle,
      description: jobDescription,
      amount: proposal.budget,
      duration: proposal.duration,
      milestones: [],
      status: "ongoing",
    });

    const savedLiveJob = await liveJob.save({ session });

    await User.findByIdAndUpdate(
      clientId,
      {
        $push: { ongoingProjects: savedLiveJob._id },
        $pull: { projects: jobId },
      },
      { new: true, useFindAndModify: false, session }
    );

    await User.findByIdAndUpdate(
      proposal.freelancer,
      {
        $push: { ongoingJob: savedLiveJob._id },
        $pull: { proposalsSent: { _id: proposal.freelancer_proposalSentId } },
      },
      { new: true, useFindAndModify: false, session }
    );

    const deletedJob = await Job.findByIdAndDelete(jobId, { session });

    if (!deletedJob) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ error: "Job not found" });
    }

    await session.commitTransaction();
    session.endSession();

    res.json({ id: stripeSession.id });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).send({ error: error.message });
  }
};
//////////////////////////////////////////////////////

const ongoingJobs = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const ongoingJobIds = user.ongoingJob;

    const liveJobs = await LiveJobs.find({ _id: { $in: ongoingJobIds } });

    res.status(200).json(liveJobs);
  } catch (error) {
    next(error);
  }
};

//////////////////////////////////////////////////////

const ongoingProjects = async (req, res, next) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id).select("ongoingProjects").populate({
      path: "ongoingProjects",
      // match: { status: "ongoing" },
      model: "LiveJob",
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user.ongoingProjects);
  } catch (error) {
    next(error); // Pass error to the error-handling middleware
  }
};
/////////////////////////////////////////////////////////////////////////

const ongoingJob_details = async (req, res, next) => {
  console.log("in job details");
  try {
    console.log("in try");
    const { id } = req.params;
    const jobDetails = await LiveJobs.findById(id); // Await the asynchronous call
    if (!jobDetails) {
      return res.status(404).json({ message: "Job not found" }); // Proper status code
    }
    console.log(jobDetails);
    res.status(200).json(jobDetails);
  } catch (error) {
    next(error); // Pass the error to the next middleware
  }
};

//////////////////////////////////////////////////////////////////////////////////
///-------------------------- ADD MILESTONE ----------------------------------------------
const addMilestone = async (req, res, next) => {
  try {
    const { id } = req.params; // Project ID from URL params
    const { description } = req.body; // Milestone description from request body
    // const userId = req.user._id; // Assuming the user ID is available from a middleware (like in a JWT payload)

    // Find the project by ID
    const project = await LiveJobs.findById(id);
    console.log("Project:", project);
    console.log("Freelancer ID:", project?.freelancer);
    // console.log("User ID:", userId);
    // Check if project exists
    if (!project) {
      return res.status(404).json({ message: "Project Not Found" });
    }

    // Check if the user is the freelancer associated with the project
    // if (project.freelancer.toString() !== userId.toString()) {
    //   return res.status(403).json({
    //     message: "You are not authorized to add a milestone to this project",
    //   });
    // }

    // Check if the project already has 3 milestones
    if (project.milestones.length >= 3) {
      return res
        .status(400)
        .json({ message: "You can only add up to 3 milestones" });
    }

    // Calculate the milestone amount as 30% of the project's total amount
    const milestoneAmount = (parseFloat(project.amount) * 0.3).toFixed(2); // Convert to float, calculate, and keep two decimal places

    // Add the new milestone with the current date and time
    project.milestones.push({
      description,
      amount: milestoneAmount,
      dateAdded: Date.now(),
    });

    // Save the updated project
    await project.save();

    // Send the updated project as the response
    return res.status(200).json(project);
  } catch (error) {
    console.error("Error adding milestone:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

/////////////////////////////////////////////////////////////////////////////////

module.exports = {
  OTP_for_Register,
  registerUser,
  loginUser,
  changeAvatar,
  getUser,
  updateUser,
  getUserProposalsWithJobData,
  userProjects,
  userBids,
  checkout,
  ongoingJobs,
  ongoingProjects,
  ongoingJob_details,
  addMilestone,
};
