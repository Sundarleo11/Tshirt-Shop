const express = require('express');
const router = express.Router();
const { isLoggedIn,customRoles } = require('../middlewares/user');
const {product,addproduct,getAllproduct}=require('../controllers/productController');


router.route("/test").get(product);

// client user
router.route("/Products").get(getAllproduct);

// admin user
router.route("/admin/product/add").post(isLoggedIn, customRoles('Admin') ,addproduct);

module.exports=router;