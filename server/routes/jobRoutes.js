const { Router } = require("express");

const { createJob, getJobs } = require("../controllers/jobControllers");
const authMiddleware = require("../middleware/authMiddleware");
//
const router = Router();
router.post("/createJob", authMiddleware, createJob);
router.get("/", getJobs);
//
module.exports = router;
