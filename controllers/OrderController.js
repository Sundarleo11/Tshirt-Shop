const bigpromise = require('../middlewares/bigpromise');
const customeError = require('../utils/customeError');
const Order = require('../models/orders');


exports.createOrder = bigpromise((req, res) => {
   const {
    shippingInfo,
    orderItems,
    paymentInfo,
    taxAmount,
    shippingAmount,
    totalAmount} =req.body;

    const order = await Order.create({
        shippingInfo,
        orderItems,
        paymentInfo,
        taxAmount,
        shippingAmount,
        totalAmount,
        user: req.user._id,
      });

    res.status(200).json({
      success: true,
      order
    });
  });
  