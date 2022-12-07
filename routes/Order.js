const express = require('express');
const router = express.Router();

const { 
    createOrder,
    getOneOrder
}

    = require("../controllers/OrderController");
const { isLoggedIn,customRoles } = require('../middlewares/user');

router.route("/orders/create").post(isLoggedIn, createOrder);
router.route("/orders/:id").get(isLoggedIn, getOneOrder);

module.exports = router;