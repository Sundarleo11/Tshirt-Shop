const express = require('express');
const router = express.Router();

const { user,
    signup,
    login,
    logout,
    forgotpassword,
    passwordReset,
    isLoggedInUser,
    changingPassword,
    updateUserDetails,
    AllAdminUser,
    mangaerAllUser,
    AdminGetOneUser,
    AdminupdateOneUserDetails,
    AdminDeleteOneUserDetails
}

    = require("../controllers/userController");
const { isLoggedIn,customRoles } = require('../middlewares/user');

router.route("/signup").post(signup);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/forgotpassword").post(forgotpassword);
router.route("/password/reset/:token").post(passwordReset);
router.route("/dashborad").get(isLoggedIn, isLoggedInUser);
router.route("/password/update").post(isLoggedIn, changingPassword);
router.route("/dashboraduserDetails/update").post(isLoggedIn, updateUserDetails);

//Admin routes
router.route("/admin/user").get(isLoggedIn, customRoles('Admin') ,AllAdminUser);
router.route("/admin/user/:id").get(isLoggedIn, customRoles('Admin') ,AdminGetOneUser);
router.route("/admin/user/:id").put(isLoggedIn, customRoles('Admin') ,AdminupdateOneUserDetails);
router.route("/admin/user/:id").delete(isLoggedIn, customRoles('Admin') ,AdminDeleteOneUserDetails);

//manager all user
router.route("/mangaerAllUser/user").get(isLoggedIn, customRoles('manager') ,mangaerAllUser);

module.exports = router;