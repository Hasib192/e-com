const User = require("../models/User");
const { hashPassword } = require("../helpers/auth");

exports.registerUser = async (req, res) => {
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
      return res.json({ error: "Email already taken" });
    }
    const hashedPassword = await hashPassword(password);

    const newUser = await new User({
      name,
      email,
      password: hashedPassword,
      address,
      role,
    }).save();

    res.json({
      message: "Data saved successful",
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
