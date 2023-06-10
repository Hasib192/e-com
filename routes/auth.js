const router = require("express").Router();
const { register, login, updateProfile } = require("../controllers/auth");
const { requireSignIn, isAdmin } = require("../middlewares/auth");

router.post("/register", register);
router.post("/login", login);

router.get("/auth-check", requireSignIn, (req, res) => {
  res.json({ status: "Success" });
});
router.get("/admin-check", requireSignIn, isAdmin, (req, res) => {
  res.json({ status: "Success" });
});

router.put("/update", requireSignIn, updateProfile);

module.exports = router;
