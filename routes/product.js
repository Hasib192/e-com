const router = require("express").Router();
const formidable = require("express-formidable")();
const { requireSignIn, isAdmin } = require("../middlewares/auth");
const { create, list, read, photo, remove, update, filterProducts, productsCount, paginationProducts, productSearch, relatedProducts } = require("../controllers/product");

router.post("/product", requireSignIn, isAdmin, formidable, create);
router.get("/products", list);
router.get("/product/:slug", read);
router.get("/product/photo/:productId", photo);
router.delete("/product/:productId", requireSignIn, isAdmin, remove);
router.put("/product/:productId", requireSignIn, isAdmin, formidable, update);
router.get("/products-count", productsCount);
router.get("/list-products/:page", paginationProducts);
router.get("/product/search/:productId", productSearch);
router.get("/related-products/:productId/:categoryId", relatedProducts);

module.exports = router;
