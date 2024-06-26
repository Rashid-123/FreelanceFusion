const { Router } = require("express");

const {
  registerUser,
  OTP_for_Register,
  loginUser,
  changeAvatar,
} = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");
const router = Router();

router.post("/register_OTP", OTP_for_Register);
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/change_Avatar", authMiddleware, changeAvatar);
module.exports = router;
