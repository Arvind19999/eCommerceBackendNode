const express = require("express");
const { getAllProducts,
       createProduct,
       updateProduct,
       getProductDetails,
       deleteProduct,
       reviewCreateUpdate,
       getProductReviews,
       deleteReview
} = require("../controllers/productController");
const { isAuthenticated, authorizeRole } = require("../middleware/auth");

const router = express.Router();


router.get("/all-products", getAllProducts);
router.get("/product/review", getProductReviews);
router.get("/product/:id", getProductDetails);

router.post("/admin/add-product/new", isAuthenticated, authorizeRole("admin"), createProduct)

router.put("/product/create-update/review", isAuthenticated, authorizeRole("admin"),reviewCreateUpdate)
router.put("/admin/update-product/:id", isAuthenticated, authorizeRole("admin"), updateProduct)

router.delete("/product/delete/review",isAuthenticated, authorizeRole("admin"),deleteReview);
router.delete("/admin/delete-product/:id", isAuthenticated, authorizeRole("admin"), deleteProduct);


module.exports = router;
