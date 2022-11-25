const cookieToken = (User, res) => {
    const token = user.getJwtToken();

    const option = {
        expires: new Date(Date.now() + process.env.cookieTime * 24 * 60 * 60 * 1000),
        httpOnly: true,
    }

    return res.status(200).cookie("token", token, option).json({
        success: true,
        user,
        token,

    });
}

module.exports = cookieToken;