const User = require('../models/user');
const Bigpromise = require('../middlewares/bigpromise');
const customeError = require('../utils/customeError');
const cookieToken = require('../utils/cookieToken');
const files = require('express-fileupload');
const cloudinary = require('cloudinary');


exports.signup = Bigpromise(async (req, res, next) => {

  const { email, name, password } = req.body;


  if (!req.files) {
    return next(new customeError("Photo is required for signup", 400));
  }
  //Modified
  if (!email || !name || !password) {
    //return res.send("email,name and password are required");
    return next(new customeError("email,name  and password are required", 400));
  }
 
    let file = req.files.photo;

    const result = await cloudinary.v2.uploader.upload(file.tempFilePath, {
      folder: "user",
      with: 150,
      crop: "scale",

    });


  


  const user = await User.create({
    email,
    name,
    password,
    photo: {
      id: result.public_id,
      secure_url: result.secure_url,
    }
  });

  cookieToken(user, res);

})