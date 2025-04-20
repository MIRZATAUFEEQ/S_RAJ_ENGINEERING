export const generateToken = (createdUser, message, statusCode, res) => {
    const token = createdUser.generateJsonWebToken()
    res.status(statusCode)
        .cookie('token', token, {
            expires: new Date(Date.now() + process.env.COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
            httpOnly: true,
            sameSite: 'None',
            secure: true
        })
        .json({
            success: true,
            message,
            token,
            createdUser
        })
}