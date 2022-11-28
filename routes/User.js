const express = require('express');
const router = express.Router();

const { user,
    signup,
    login,
    logout,
    forgotpassword,
    passwordReset,
    isLoggedInUser,
    changingPassword
}

    = require("../controllers/userController");
const { isLoggedIn } = require('../middlewares/user');

router.route("/signup").post(signup);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/forgotpassword").post(forgotpassword);
router.route("/password/reset/:token").post(passwordReset);
router.route("/dashborad").get(isLoggedIn, isLoggedInUser);
router.route("/password/update").post(isLoggedIn, changingPassword);

module.exports = router;