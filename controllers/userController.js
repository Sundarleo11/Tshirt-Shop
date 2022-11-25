const User=require('../models/user');
const Bigpromise=require('../middlewares/bigpromise');
const customeError=require('../utils/customeError');
const cookieToken = require('../utils/cookieToken');



exports.signup= Bigpromise(async(req,res,next)=>{
  
  const {email,name,password}=req.body;
 
  //Modified
  if(!email || !name || !password){
    //return res.send("email,name and password are required");
    return next(new customeError("email,name  and password are required", 400));
  }

  const user=await User.create({
    email,
    name,
    password
  });

  cookieToken(user,res);

})