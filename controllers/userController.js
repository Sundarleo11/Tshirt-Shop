const User = require('../models/user');
const Bigpromise = require('../middlewares/bigpromise');
const customeError = require('../utils/customeError');
const cookieToken = require('../utils/cookieToken');
const files = require('express-fileupload');
const cloudinary = require('cloudinary');
const user = require('../models/user');
const mailHelper=require('../utils/mailhelp');


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

exports.login = Bigpromise(async (req, res, next) => {

  const { email, password } = req.body;
  if (!email || !password) {
    return next(new customeError("Please provide your email and password", 400));
  }

  const user = await User.findOne({ email }).select("+password");
  const ispassword = await user.isValidatedPassword(password);


  if (!user || !ispassword) {
    return next(new customeError("Please check your email and password", 400));
  }

  cookieToken(user, res);
})

exports.logout = Bigpromise(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  return res.status(200).json({
    success: true,
    message: "Logout successfully"

  });
})

exports.forgotpassword = Bigpromise(async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return next(new customeError("Email is required for reset the password", 400));
  }

  const forgottoken = user.getforgotpasswordToken()
  await user.save({ validateBeforeSave: false });
  const myurl = `${req.protocol}://${req.get("host")}/password/reset/${forgottoken}`;

  const message = `copy and past this url and hit enter /n/n, ${myurl}`;

  try {
    await mailHelper({
      email: user.email,
      subject: 'Tshort shop',
      email,

    })
    return res.status(200).json({
      success: true,
      message: "Tshort shop website for password Reset an email"
    })
  } catch (error) {
    user.forgotpassword = undefined,
      user.forgottoken = undefined,
      await user.save({ validateBeforeSave: false });
    return next(new customeError(console.message, 500));
  }


})