const User=require('../models/user');
const Bigpromise=require('../middlewares/bigpromise');

exports.signup= Bigpromise(async(req,res,next)=>{
  res.send("Yups")
})