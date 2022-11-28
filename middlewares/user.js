const Bigpromise = require('../middlewares/bigpromise');
const customeError = require('../utils/customeError');
const jwt=require('jsonwebtoken');
const user = require('../models/user');


exports.isLoggedIn=Bigpromise(async(req,res,next)=>{
    const token=req.cookies.token || req.header("Authorization").replace("Bearer ","");

    if(!token){
        return next(new customeError("Please login first to visits the application", 400));
    }
      const decode=jwt.verify(token,process.env.JWT_SECRET);
     req.user= await user.findById(decode.id);

     next();

})