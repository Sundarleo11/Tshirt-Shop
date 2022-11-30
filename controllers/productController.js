const bigpromise = require('../middlewares/bigpromise');


exports.product = bigpromise((req, res) => {

    res.status(200).json({
        success: true,
        greeting: "Product controller Api"
    });
});