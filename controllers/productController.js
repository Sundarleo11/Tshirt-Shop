const bigpromise = require('../middlewares/bigpromise');
const cloudinary = require('cloudinary');
const customeError = require('../utils/customeError');
const Product = require('../models/product');
const WhereClause = require('../utils/whereclause');



exports.product = bigpromise((req, res) => {

  res.status(200).json({
    success: true,
    greeting: "Product controller Api"
  });
});


exports.addproduct = (async (req, res, next) => {


  const ImageArray = [];

  if (!req.files) {
    return next(new customeError("Photo are required whille add the product", 401));
  }

  if (req.files) {
    for (let index = 0; index < req.files.photo.length; index++) {

      let result = await cloudinary.v2.uploader.upload(
        req.files.photo[index].tempFilePath, {
        folder: "products",
        with: 150,
        crop: "scale",

      });

      ImageArray.push({
        id: result.public_id,
        secure_url: result.secure_url,
      });

    }
  }
  console.log(req.user.id);
  req.body.photo = ImageArray;
  req.body.user = req.user.id;

  const product = await Product.create(req.body);
  return res.status(200).json({
    success: true,
    product
  })




})

exports.getAllproduct = (async (req, res, next) => {
  const resultperpage = 6;

  const totalproductCount = await Product.countDocuments();

  const productObj = new WhereClause(Product.find(),req.query).search().filter();

  const product=productObj.base;

  const filterproductCount = product.length;

  productObj.pager(resultperpage);
  
  products = await productObj.base.clone();


  return res.status(200).json({
    success: true,
    totalproductCount,
    filterproductCount,
    products,


  })




})