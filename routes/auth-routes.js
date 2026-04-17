const express = require("express");
const { registerUser, loginUser, changePassword } = require("../controllers/auth-controller");
const authMiddleware = require("../middleware/middleware");
const router = express.Router();

//routes

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/change-password",authMiddleware,changePassword);

module.exports = router;
