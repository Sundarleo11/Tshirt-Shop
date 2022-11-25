const cookieToken = (User, res) => {
    const token = User.getJwtToken();

    const option = {
        expires: new Date(Date.now() + process.env.cookieTime * 24 * 60 * 60 * 1000),
        httpOnly: true,
    }
     User.password=undefined;
    return res.status(200).cookie("token", token, option).json({
        success: true,
        User,
        token,

    });
}

module.exports = cookieToken;