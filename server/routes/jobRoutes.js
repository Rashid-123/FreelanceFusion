const { Router } = require("express");

const {
  createJob,
  getJobs,
  category_job,
  get_job_details,
} = require("../controllers/jobControllers");
const authMiddleware = require("../middleware/authMiddleware");
//
const router = Router();
router.post("/createJob", authMiddleware, createJob);
router.get("/", getJobs);
router.get("/:category", category_job);
router.get("/details/:id", get_job_details);
//
module.exports = router;
