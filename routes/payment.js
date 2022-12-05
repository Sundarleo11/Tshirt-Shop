const express = require('express');
const router = express.Router();
const { isLoggedIn  } = require('../middlewares/user');
const {sendStripeKey,
     captureStripePayment,
     sendRazorpayKey,
     captureRazorpayPayment
   
}=require('../controllers/PaymentController');


router.route("/StripeKey").get(sendStripeKey);
router.route("/RazorpayKey").get(sendRazorpayKey);
router.route("/CaptureStripePayment").post(captureStripePayment);
router.route("/CaptureRazorpayPayment").post(captureRazorpayPayment);



module.exports=router;