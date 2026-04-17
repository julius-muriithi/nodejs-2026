const Users = require("../models/models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// register user

const registerUser = async (req, res) => {
  try {
    //extract data from user

    const { username, password, email, role } = req.body;

    //check whether the name exists in the database
    const checkCredentials = await Users.findOne({
      $or: [{ username }, { email }],
    });
    if (checkCredentials) {
      return res.status(400).json({
        success: false,
        message: "username or email already exists",
      });
    } else {
      //create a new user and hashing the password
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);

      const newUser = new Users({
        username,
        email,
        password: hash,
        role: role || "user",
      });
      await newUser.save();
      if (newUser) {
        res.status(201).json({
          success: true,
          message: "Account created successfully",
          data: newUser,
        });
      } else {
        res.status(400).json({
          success: false,
          message: "Unable to register user!Please try again",
        });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong.Please try again later ",
    });
  }
};
const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    //cheking if username exists
    const user = await Users.findOne({ username });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }
    //checking the password
    const matchPassword = await bcrypt.compare(password, user.password);
    if (!matchPassword) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }
    const accessToken = jwt.sign(
      {
        userId: user.id,
        username: user.username,
        role: user.role,
      },
      process.env.JWT_KEY,
      { expiresIn: "15m" },
    );
    res.status(200).json({
      success: true,
      message: "Logged in Successful",
      accessToken,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong.Please try again later ",
    });
  }
};

const changePassword = async (req, res) => {
  try {
    const userId = req.userInfo.userId;
    //extracting passwords
    const { oldPassword, newPassword } = req.body;
    //finding the current user
    const user = await Users.findById(userId);

    if (!user) {
      res.status(400).json({
        success: false,
        message: "User not found",
      });
    }
    //Check if the old password is correct

    const matchingPassword = await bcrypt.compare(oldPassword, user.password);
    if (!matchingPassword) {
      return res.status(400).json({
        success: false,
        message: "Old password is incorrect",
      });
    }
    //hash a new password
    const salt = await bcrypt.genSalt(10);
    const newHashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = newHashedPassword;
    await user.save();
    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong.Please try again later ",
    });
  }
};

module.exports = { registerUser, loginUser,changePassword };
