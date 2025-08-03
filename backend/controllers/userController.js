import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";

// login user
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User Doesn't exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.json({ success: false, message: "Invalid credentials" });
    }

    const token = createToken(user._id, user.role);
    res.json({
      success: true,
      token,
      role: user.role,
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

const createToken = (id, role) => {
  return jwt.sign({ id: id, role: role }, process.env.JWT_SECRET);
};

// register user
const registerUser = async (req, res) => {
  const role = "user";
  const { name, password, email } = req.body;
  try {
    // checking is user already exists
    const exists = await userModel.findOne({ email });
    if (exists) {
      return res.json({ success: false, message: "User already exists" });
    }
    // validating email format & string password
    if (!validator.isEmail(email)) {
      return res.json({
        success: false,
        message: "Please enter a valid email",
      });
    }

    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Please enter a strong password",
      });
    }

    // hashing user password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({
      name: name,
      email: email,
      password: hashedPassword,
      role: role,
    });

    const user = await newUser.save();
    const token = createToken(user._id);
    res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// register user by Admin
const registerUserByAdmin = async (req, res) => {
  const { name, password, email, role } = req.body;
  try {
    // checking is user already exists
    const exists = await userModel.findOne({ email });
    if (exists) {
      return res.json({ success: false, message: "User already exists" });
    }
    // validating email format & string password
    if (!validator.isEmail(email)) {
      return res.json({
        success: false,
        message: "Please enter a valid email",
      });
    }

    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Please enter a strong password",
      });
    }

    // hashing user password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({
      name: name,
      email: email,
      password: hashedPassword,
      role: role,
    });

    const user = await newUser.save();
    res.json({ success: true });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

const getDeliverers = async (req, res) => {
  try {
    const deliverers = await userModel
      .find({ role: "deliverer" })
      .select("name email _id")
      .lean();

    res.status(200).json({
      success: true,
      deliverers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching deliverers",
      error: error.message,
    });
  }
};

export {
  loginUser,
  registerUser,
  registerUserByAdmin,
  getDeliverers,
};
