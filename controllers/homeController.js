const bigpromise = require('../middlewares/bigpromise');


exports.home = bigpromise((req, res) => {

    res.status(200).json({
        success: true,
        greeting: "Home controller Api"
    });
});