const jwt = require("jsonwebtoken");
const User = require("../models/user");

exports.requireSignIn = (req, res, next) => {
  const token = req.headers.authorization;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ status: "Unauthorized", data: error });
  }
};

exports.isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).exec();
    if (user.role !== 1) {
      res.status(401).send("Unauthorized");
    } else {
      next();
    }
  } catch (error) {
    res.status(401).json({ status: "Unauthorized", data: "error" });
  }
};
