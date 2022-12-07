const express = require('express');
const router = express.Router();

const { 
    createOrder,
    getOneOrder,
    getLoggedInOrder,
    admingetAllOrders,
    adminUpdateOrder,
    adminDeleteOrder


}

    = require("../controllers/OrderController");
const { isLoggedIn,customRoles } = require('../middlewares/user');

router.route("/orders/create").post(isLoggedIn, createOrder);
router.route("/orders/:id").get(isLoggedIn, getOneOrder);
//router.route("/orders/myorder").get(isLoggedIn, getLoggedInOrder);
router.route("/myorder").get(isLoggedIn, getLoggedInOrder);


//admin routes
router
  .route("/admin/orders")
  .get(isLoggedIn, customRoles("Admin"), admingetAllOrders);
router
  .route("/admin/order/:id")
  .put(isLoggedIn, customRoles("Admin"), adminUpdateOrder)
  .delete(isLoggedIn, customRoles("Admin"), adminDeleteOrder);


module.exports = router;