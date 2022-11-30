const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({

    name: {
        type: String,
        required: [true, 'please provide the product name'],
        maxlengmaxlength: [120, "ProductName should be 120 char"]
    },
    price: {
        type: Number,
        required: [true, 'please provide the product price'],
        maxlengmaxlength: [6, "price should be 6 char"]
    },
    description: {
        type: String,
        required: [true, 'please provide the description of product details'],
    },
    photo: {
        id: {
            type: String,

        },
        secure_url: {
            type: String,
        }
    },

    category: {
        type: String,
        required: [
            true,
            "please select category from- short-sleeves, long-sleeves, sweat-shirts, hoodies",
        ],
        enum: {
            values: ["shortsleeves", "longsleeves", "sweatshirt", "hoodies"],
            message:
                "please select category ONLY from - short-sleeves, long-sleeves, sweat-shirts and hoodies ",
        },
    },

    stock: {
        type: Number,
        required: [true, "please add a number in stock"],
    },
    brand: {
        type: String,
        required: [true, "please add a brand for clothing"],
    },
    ratings: {
        type: Number,
        default: 0,
    },
    numberOfReviews: {
        type: Number,
        default: 0,
    },
    reviews: [
        {
            user: {
                type: mongoose.Schema.ObjectId,
                ref: "User",
                required: true,
            },
            name: {
                type: String,
                required: true,
            },
            rating: {
                type: Number,
                required: true,
            },
            comment: {
                type: String,
                required: true,
            },
        },
    ],
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Product", productSchema);
