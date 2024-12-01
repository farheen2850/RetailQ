const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const dotenv = require("dotenv");

dotenv.config(); 

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, username: user.username, email: user.email },
    process.env.JWT_SECRET
  );
};

const validateToken = (token) => {
  const result = jwt.verify(token, process.env.JWT_SECRET);
  return !!result.username;
};

const Auth = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')?.[1];
  if(!token) {
    return res.status(401).json({ message: 'No token found' });
  }
  try {
    if (validateToken(token)) {
      next();
    } else {
      return res.status(400).json({ message: 'No data found in token!' });
    }
  } catch(e) {
    res.status(401).json({ message: 'Invalid token!' });
  }
};

const signup = async (req, res) => {
  console.log("Sign-up route hit");
  const { username, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    const token = generateToken(newUser);

    res.status(200).json({
      message: "User registered successfully",
      token,
    });
  } catch (err) {
    console.error("Error during sign-up:", err);
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
};

const signin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const token = await validatePassword(email, password);
    res.status(200).json({ message: "Signed in successfully", token });
  } catch(errorCode) {
    switch (errorCode) {
      case 401:
        res.status(401).json({ message: "Invalid password" });
        break;
      case 404:
        res.status(404).json({ message: "User not found" });
        break;
      case 500:
        res.status(500).json({ message: "Server error", error: error.message });
    }
  }
  
};

async function validatePassword(email, password) {
  try {
    const user = await User.findOne({ email });
    if (!user) throw 404;

    const isPasswordValid = await bcrypt.compare(password, user.password);

    console.log("Password match result:", isPasswordValid); 
    if (!isPasswordValid) throw 401;

    console.log("Password is valid");

    return generateToken(user);
  } catch (error) {
    throw 500;
  }
}

module.exports = { signup, signin, Auth };