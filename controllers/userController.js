const User = require('../models/user');
const Bigpromise = require('../middlewares/bigpromise');
const customeError = require('../utils/customeError');
const cookieToken = require('../utils/cookieToken');
const files = require('express-fileupload');
const cloudinary = require('cloudinary');
const user = require('../models/user');
const mailHelper = require('../utils/mailhelp');
const crypto = require('crypto');

exports.signup = Bigpromise(async (req, res, next) => {


  if (!req.files) {
    return next(new customeError("Photo is required for signup", 400));
  }
  const { email, name, password } = req.body;
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


  //identify bug
  if (!user) {
    return next(new customeError("Please check your email ", 400));
  }

  const ispassword = await user.isValidatedPassword(password);

  if (!ispassword) {
    return next(new customeError("Please check your password", 400));
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
  const myurl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${forgottoken}`;
  console.log(forgottoken);

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
    // corrected token
    user.forgotPasswordToken = undefined;
    user.forgotpasswordExpiry = undefined;
    await user.save({ validateBeforeSave: false });
    // await user.save({ validateBeforeSave: false });
    return next(new customeError(error.message, 500));
  }


})


exports.passwordReset = Bigpromise(async (req, res, next) => {

  const token = req.params.token;

  const encrpToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    encrpToken,
    forgotPasswordExpiry: { $gt: Date.now() },
  });

  if (!user) {
    return next(new customeError("Token has expired or invalied token", 400));
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(new customeError("Password is doesn't match, Please check", 400));
  }

  user.password = req.body.password;



  user.forgotPasswordToken = undefined,
    user.forgotPasswordExpiry = undefined,

    await user.save();
  cookieToken(user, res);
})

exports.isLoggedInUser = Bigpromise(async (req, res, next) => {

  const userdetails = await User.findOne(req.body.id);
  return res.status(200).json({
    success: true,
    userdetails

  })

})

exports.changingPassword = Bigpromise(async (req, res, next) => {

  const userId = req.body.password;

  const user = await User.findOne({ userId }).select("+password");

  const isCorrectOldPassword = await user.isValidatedPassword(req.body.oldPassword);

  if (!isCorrectOldPassword) {
    return next(new customeError("Please check your Password while changing new Passwod", 400));
  }

  //Update the Password In DB
  user.password = req.body.password;

  await user.save();

  cookieToken(user, res);

})
exports.updateUserDetails = Bigpromise(async (req, res, next) => {

  const newData = {
    name: req.body.name,
    email: req.body.email,
  }

  if (req.files) {
    const user = await User.findById(req.user.id);
    const ImageId = user.photo.id;

    const resp = await cloudinary.v2.uploader.destroy(ImageId);

    const result = await cloudinary.v2.uploader.upload(req.files.photo.tempFilePath, {
      folder: "user",
      with: 150,
      crop: "scale",

    });

    newDatephoto = {
      id: result.public_id,
      secure_url: result.secure_url,
    }
  }

  // update the data in user
  const user = await User.findByIdAndUpdate(req.user.id, newData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  //await User.save();

  return res.status(200).json({
    success: true,
    user
  })
})

exports.AllAdminUser = Bigpromise(async (req, res, next) => {

  const users =await User.find();

  return res.status(200).json({
    success:true,
    users
  })

})
exports.AdminGetOneUser = Bigpromise(async (req, res, next) => {

  const users =await User.findById(req.params.id);

  return res.status(200).json({
    success:true,
    users
  })

})
exports.mangaerAllUser = Bigpromise(async (req, res, next) => {

  const users =await User.find( {role:"user"});

  return res.status(200).json({
    success:true,
    users
  })

})


