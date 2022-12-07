const bigpromise = require('../middlewares/bigpromise');
const customeError = require('../utils/customeError');
const Order = require('../models/orders');
const Product = require('../models/orders');

exports.createOrder = bigpromise(async (req, res, next) => {
  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    taxAmount,
    shippingAmount,
    totalAmount } = req.body;

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

exports.getOneOrder = bigpromise(async (req, res, next) => {
  /*  const order=  await Order.findById(req.params.id).populate(
        "User",
        //"name email"
    );*/
  const order = await Order.findById(req.params.id);
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

exports.getLoggedInOrder = bigpromise(async (req, res, next) => {

  const order = await Order.find({ users: req.params._id }).exec();

  if (!order) {
    return next(new customeError("Order id not found", 401));
  }

  res.status(200).json({
    success: true,
    order
  });
});

exports.admingetAllOrders = bigpromise(async (req, res, next) => {
  const orders = await Order.find();

  res.status(200).json({
    success: true,
    orders,
  });
});

exports.adminUpdateOrder = bigpromise(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  //console.log(order);
  // console.log(order.orderStatus);
  if (order.orderStatus === "Delivered") {
    return next(new customeError("Order is already marked for delivered", 401));
  }

  order.orderStatus = req.body.orderStatus;

  order.orderItems.forEach(async (prod) => {
    await updateProductStock(prod.product, prod.quantity);
  });

  await order.save();

  res.status(200).json({
    success: true,
    order,
  });
});



async function updateProductStock(productId, quantity) {
  const product = await Product.findById(productId);

  product.stock = product.stock - quantity;

  await product.save({ validateBeforeSave: false });
}


exports.adminDeleteOrder = bigpromise(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  await order.remove();

  res.status(200).json({
    success: true,
  });
});
