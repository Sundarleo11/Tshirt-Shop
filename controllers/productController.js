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


exports.addproduct = bigpromise(async (req, res, next) => {


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

exports.AdminGetAllProduct = (async (req, res, next) => {

  const Products = await Product.find();

  return res.status(200).json({
    success: true,
    Products
  })




})

exports.singleProducts = (async (req, res, next) => {

  const Products = await Product.findById(req.params.id);

  if(!Products){
    return next(new customeError("Products is not there",401));
  }


  return res.status(200).json({
    success: true,
    Products
  })




})

exports.AdminUpdateOneProduct=bigpromise(async(req,res,next)=>{
  
  const Products = await Product.findById(req.params.id);

  if(!Products){
    return next(new customeError("Products is not there",401));
  }

  const ImageArray = [];

  if (!req.files) {
    return next(new customeError("Photo are required whille add the product", 401));
  }

  if (req.files) {

    //destory the image  
    for (let index = 0; index <Products.photo.length; index++) {
      const resp = await cloudinary.v2.uploader.destroy(Products.photo[index].id);
      
    }
      
    
    //update the image 
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
 
  req.body.photo = ImageArray;
 const product= await Product.findByIdAndUpdate(req.params.id, req.body,{
    new :true,
    runValidators:true,
    userFindAndModify:false
 })


  return res.status(200).json({
    success: true,
    product
  })
})

exports.AdminDeleteOneProduct=(async(req,res,next)=>{
  
  const Products = await Product.findById(req.params.id);

  if(!Products){
    return next(new customeError("Products is not there",401));
  }

  for (let index = 0; index <Products.photo.length; index++) {
    const resp = await cloudinary.v2.uploader.destroy(Products.photo[index].id);
    
  }
  await Products.remove();
 
  return res.status(200).json({
    success: true,
    message:"successfully Delete the Product !"
  })
})

exports.getAllproduct = bigpromise(async (req, res, next) => {
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

exports.AddReview =bigpromise (async (req, res, next) => {
  
const {productId,comment,rating}=req.body;

const review ={
  user:req.body._id,
  name:req.body.name,
  rating:Number(rating),
  comment
}

const product=Product.findById(productId)
const AlreadyReview= product.reviews.find(
  (rev)=rev.user.toString()=== req.user._id.toString()
);

if (AlreadyReview) {
  product.reviews.forEach((review) => {
    if (review.user.toString() === req.user._id.toString()) {
      review.comment = comment;
      review.rating = rating;
    }
  });
} else {
  product.reviews.push(review);
  product.numberOfReviews = product.reviews.length;
}

// adjust ratings

product.ratings =
  product.reviews.reduce((acc, item) => item.rating + acc, 0) /
  product.reviews.length;

//save

await product.save({ validateBeforeSave: false });

res.status(200).json({
  success: true,
});
  





})

exports.deleteReview = bigpromise(async (req, res, next) => {
  const { productId } = req.query;

  const product = await Product.findById(productId);

  const reviews = product.reviews.filter(
    (rev) => rev.user.toString() === req.user._id.toString()
  );

  const numberOfReviews = reviews.length;

  // adjust ratings

  product.ratings =
    product.reviews.reduce((acc, item) => item.rating + acc, 0) /
    product.reviews.length;

  //update the product

  await Product.findByIdAndUpdate(
    productId,
    {
      reviews,
      ratings,
      numberOfReviews,
    },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  res.status(200).json({
    success: true,
  });
});

exports.getOnlyReviewsForOneProduct = bigpromise(async (req, res, next) => {
  const product = await Product.findById(req.query.id);

  res.status(200).json({
    success: true,
    reviews: product.reviews,
  });
});