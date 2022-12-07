const express = require('express');
const router = express.Router();

const { 
    createOrder,
    getOneOrder,
    getLoggedInOrder
}

    = require("../controllers/OrderController");
const { isLoggedIn,customRoles } = require('../middlewares/user');

router.route("/orders/create").post(isLoggedIn, createOrder);
router.route("/orders/:id").get(isLoggedIn, getOneOrder);
//router.route("/orders/myorder").get(isLoggedIn, getLoggedInOrder);
router.route("/myorder").get(isLoggedIn, getLoggedInOrder);

module.exports = router;