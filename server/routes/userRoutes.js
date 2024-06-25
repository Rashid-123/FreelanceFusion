const { Router } = require("express");

const {
  registerUser,
  OTP_for_Register,
} = require("../controllers/userController");

const router = Router();

router.post("/register_OTP", OTP_for_Register);
router.post("/register", registerUser);

module.exports = router;
