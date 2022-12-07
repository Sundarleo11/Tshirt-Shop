const bigpromise = require('../middlewares/bigpromise');
const customeError = require('../utils/customeError');
const Order = require('../models/orders');


exports.createOrder = bigpromise(async(req, res,next) => {
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

exports.getOneOrder = bigpromise(async(req, res, next) => {
  /*  const order=  await Order.findById(req.params.id).populate(
        "User",
        //"name email"
    );*/
    const order= await Order.findById(req.params.id);
    //.populate({path:'users', select:'name'});
    //.exec()

    if (!order) {
        return next(new customeError("Order id not found", 401));
    }
 
     res.status(200).json({
       success: true,
       order
     });
   });



   exports.getLoggedInOrder = bigpromise(async(req, res, next) => {
   
      const order= await Order.find({users:req.params._id}).exec();
      
      if (!order) {
          return next(new customeError("Order id not found", 401));
      }
   
       res.status(200).json({
         success: true,
         order
       });
     });
   
  