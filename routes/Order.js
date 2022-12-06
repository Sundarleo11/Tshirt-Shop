const express = require('express');
const router = express.Router();

const { 
}

    = require("../controllers/OrderController");
const { isLoggedIn,customRoles } = require('../middlewares/user');

router.route("/orders/create").post(isLoggedIn, createOrder);
module.exports = router;