const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("../models/userModel");
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
    const { name, email, password, password2, otp } = req.body;
    if (!name || !email || !password || !otp) {
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

    const storedOTP = otpStorage[newEmail];
    if (!storedOTP || parseInt(otp) !== storedOTP) {
      return next(new HttpError("Invalid OTP.", 422));
    }

    // Clear the OTP from storage after successful registration
    delete otpStorage[newEmail];

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
    const { id } = req.params;
    const user = await User.findById(id).select("-password");
    if (!user) {
      return next(new HttpError("User not found", 404));
    }
    console.log(user);
    let avatarURL;
    if (user.avatar) {
      avatarURL = await getObjectURL(user.avatar);
    }

    const userResponse = {
      ...user.toObject(),
    };

    if (avatarURL) {
      userResponse.avatarURL = avatarURL;
    }

    res.status(200).json(userResponse);
  } catch (error) {
    return next(new HttpError(error));
  }
};
//////////////////////////////////////////////////////////////////////////////////
//-------------------- GET ALL USERS --------------------------------------

module.exports = {
  OTP_for_Register,
  registerUser,
  loginUser,
  changeAvatar,
  getUser,
};
