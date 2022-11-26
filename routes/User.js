const express=require('express');
const router= express.Router();

const {user, signup,login}=require("../controllers/userController");

router.route("/signup").post(signup);
router.route("/login").post(login);

module.exports= router;