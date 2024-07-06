const { Router } = require("express");

const {
  createJob,
  getJobs,
  category_job,
  get_job_details,
  addProposal,
} = require("../controllers/jobControllers");
const authMiddleware = require("../middleware/authMiddleware");
//
const router = Router();
router.post("/createJob", authMiddleware, createJob);
router.get("/", getJobs);
router.get("/:category", category_job);
router.get("/details/:id", get_job_details);
router.post("/add_proposal/:id", authMiddleware, addProposal);
//
module.exports = router;
