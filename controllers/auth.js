const User = require("../models/User");
const { hashPassword, comparePassword } = require("../helpers/auth");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  const { name, email, password, address, role } = req.body;
  try {
    if (!name.trim()) {
      res.json({ error: "Name is required" });
    }
    if (!email) {
      res.json({ error: "Email is required" });
    }
    if (!password || password < 6) {
      res.json({ error: "Password is required" });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.json({ error: "Email already taken" });
    }
    const hashedPassword = await hashPassword(password);

    const newUser = await new User({
      name,
      email,
      password: hashedPassword,
      address,
      role,
    }).save();

    res.status(201).json({
      message: "Registration successful",
      user: {
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.log(error);
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email) {
      res.json("Email is required");
    }
    if (!password || password < 6) {
      res.json("Password is required");
    }
    const user = await User.findOne({ email });
    if (!user) {
      res.json("User not found");
    }

    const matchPassword = await comparePassword(password, user.password);
    if (!matchPassword) {
      res.json("Invalid email or password");
    }

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).json({
      message: "Login Successful",
      user: {
        name: user.name,
        email: user.email,
        address: user.address,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.log(error);
  }
};
