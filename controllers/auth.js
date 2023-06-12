const User = require("../models/user");
const { hashPassword, comparePassword } = require("../helpers/auth");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    const { name, email, password, address, role } = req.body;
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
      status: "Success",
      data: {
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    res.status(200).json({
      status: "Fail",
      data: error,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
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
      status: "Success",
      user: {
        name: user.name,
        email: user.email,
        address: user.address,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    res.status(200).json({
      status: "Fail",
      data: error,
    });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, password, address } = req.body;

    if (password && password < 6) {
      return res.json("Password must be atleast 6 character long.");
    }
    const id = req.user._id;
    const user = await User.findById(id);

    // Set given new name
    const updatedName = name ? name.trim() : user.name;

    // Set given hashed password
    const updatedHashedPassword = password ? await hashPassword(password) : user.password;

    // Set give new address
    const updatedAdress = address ? address.trim() : user.address;

    const update = {
      name: updatedName,
      password: updatedHashedPassword,
      address: updatedAdress,
    };

    const options = {
      upsert: true,
      new: true,
      select: "-password",
    };

    const result = await User.findByIdAndUpdate(id, update, options);

    res.status(200).json({ status: "Success", data: result });
  } catch (error) {
    res.status(200).json({ status: "Fail", data: error });
  }
};
