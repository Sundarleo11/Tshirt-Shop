const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

//corrected object creation
const userSchema = new mongoose.Schema({

    name: {
        type: String,
        required: [true, "provide the a name"],
        maxlength: [40, "Name should under a char"]
    },
    email: {
        type: String,
        required: [true, "provide the a email"],
        validate: [validator.isEmail, "Please provide the correct format an email"],
        unquie: true
    },
    password: {
        type: String,
        required: [true, "please provide the password"],
        maxlength: [6, "password should atleast 6 char"],
        select: false
    },
    role: {
        type: String,
        default: 'user'
    },
    photo: {
        id: {
            type: String,
            required: true
        },
        secure_url: {
            type: String,
            required: true

        }
    },
    forgotPasswordToken: String,
    forgotpasswordExpiry: Date,
    CreatedAt: {
        type: Date,
        default: Date.now
    }

});

// crypt the password 
userSchema.pre("save", async function(next) {

    if (!this.isModified('password')) {
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10);
});

//validate password 
userSchema.methods.isValidatedPassword = async function (userpassword) {
    return await bcrypt.compare(userpassword, this.password);
};


//create and return jwt token
userSchema.methods.getJwtToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRY,
    });
};


// generate the forgot token
userSchema.methods.getforgotpasswordToken = function () {

    // generate random string
    const forgotToken = crypto.randomBytes(20).toString("hex");

    // decrypet the words 
    this.forgotPasswordToken = crypto.createHash("sha256").update(forgotToken).digest("hex");

    //token taken time
    this.forgotpasswordExpiry = Date.now() + process.env.FTE;

    return forgotToken;

}



module.exports = mongoose.model("user", userSchema);