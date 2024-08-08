const { Router } = require("express");

const {
  registerUser,
  OTP_for_Register,
  loginUser,
  changeAvatar,
  getUser,
  updateUser,
  checkout,
  userProjects,
  userBids,
  ongoingJobs,
  ongoingProjects,
  ongoingJob_details,
} = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");

const router = Router();

router.post("/register_OTP", OTP_for_Register);
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/change_Avatar", authMiddleware, changeAvatar);
router.get("/:id", authMiddleware, getUser);
router.post("/updateUser/:id", authMiddleware, updateUser);
//
router.get("/projects/:id", authMiddleware, userProjects);
router.get("/userBids/:id", authMiddleware, userBids);
router.get("/ongoingJobs/:id", authMiddleware, ongoingJobs);
router.get("/ongoingProjects/:id", authMiddleware, ongoingProjects);
router.get("/ongoingjob_details/:id", authMiddleware, ongoingJob_details);

router.post("/create-checkout-session", checkout);
module.exports = router;
