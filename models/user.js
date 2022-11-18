const mongoose = require('mongoose');
const validator = require('validator');


const userSchema = new mongoose.Mongoose({

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




module.exports = mongoose.model("user", userSchema);