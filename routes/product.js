const express = require('express');
const router = express.Router();
const { isLoggedIn,customRoles } = require('../middlewares/user');
const {product,addproduct,getAllproduct,AdminGetAllProduct,singleProducts,AdminUpdateOneProduct}=require('../controllers/productController');


router.route("/test").get(product);

// client user

router.route("/Products").get(getAllproduct);
router.route("/Products/:id").get(singleProducts);

// admin user
router.route("/admin/product/add").post(isLoggedIn, customRoles('Admin') ,addproduct);
router.route("/admin/Products").get(isLoggedIn, customRoles('Admin') ,AdminGetAllProduct);
router.route("/admin/Product/:id").put(isLoggedIn, customRoles('Admin') ,AdminUpdateOneProduct);

module.exports=router;