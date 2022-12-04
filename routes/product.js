const express = require('express');
const router = express.Router();
const { isLoggedIn,customRoles } = require('../middlewares/user');
const {product,
    addproduct,
    getAllproduct,
    AdminGetAllProduct,
    singleProducts,
    AdminUpdateOneProduct,
    AdminDeleteOneProduct,
    AddReview,
    deleteReview,
    getOnlyReviewsForOneProduct
}=require('../controllers/productController');


router.route("/test").get(product);

// client user

router.route("/Products").get(getAllproduct);
router.route("/Products/:id").get(singleProducts);
router.route("/review").put(isLoggedIn,AddReview);
router.route("/review").delete(isLoggedIn,deleteReview);
router.route("/reviews").get(isLoggedIn,getOnlyReviewsForOneProduct);

// admin user
router.route("/admin/product/add").post(isLoggedIn, customRoles('Admin') ,addproduct);
router.route("/admin/Products").get(isLoggedIn, customRoles('Admin') ,AdminGetAllProduct);
router.route("/admin/Product/:id").put(isLoggedIn, customRoles('Admin') ,AdminUpdateOneProduct);
router.route("/admin/Product/:id").delete(isLoggedIn, customRoles('Admin') ,AdminDeleteOneProduct);

module.exports=router;