const router = require("express").Router();
const { read, create, update, remove, list, productsByCategory } = require("../controllers/category");
const { requireSignIn, isAdmin } = require("../middlewares/auth");

router.post("/category", requireSignIn, isAdmin, create);
router.put("/category/:categoryId", requireSignIn, isAdmin, update);
router.delete("/category/:categoryId", requireSignIn, isAdmin, remove);
router.get("/category", list);
router.get("/category/:slug", read);
router.get("/products-by-category/:slug", productsByCategory);

module.exports = router;
