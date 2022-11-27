const express=require('express');
const router= express.Router();

const {user, signup,login,logout,forgotpassword}=require("../controllers/userController");

router.route("/signup").post(signup);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/forgotpassword").post(forgotpassword);

module.exports= router;