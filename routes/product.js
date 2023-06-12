const router = require("express").Router();
const formidable = require("express-formidable")();
const { requireSignIn, isAdmin } = require("../middlewares/auth");

const { create, list, read, photo, remove, update } = require("../controllers/product");

router.post("/product", requireSignIn, isAdmin, formidable, create);
router.get("/product", list);
router.get("/product/:slug", read);
router.get("/product/photo/:productId", photo);
router.delete("/product/:productId", requireSignIn, isAdmin, remove);
router.put("/product/:productId", requireSignIn, isAdmin, formidable, update);

module.exports = router;
