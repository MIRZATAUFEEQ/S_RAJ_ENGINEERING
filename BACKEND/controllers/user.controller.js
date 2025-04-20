import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiError } from '../utils/ApiError.js'
import { User } from '../models/user.model.js'
import { uploadOnCloudinary } from '../config/cloudinary.js'
import { generateToken } from '../utils/generateToken.js'
import { v2 as cloudinary } from 'cloudinary'
import { forgotPasswordEmail } from '../utils/forgotPasswordEmail.js'
import crypto from 'crypto'

// 😃😐😎 Register user
export const register = asyncHandler(async (req, res) => {
    const { fullName, email, phone, aboutMe, password, instagramUrl } = req.body;
    if (!fullName || !email || !phone || !aboutMe || !password) {
        throw new ApiError(400, 'All fields are required')
    }
    const exitedUser = await User.findOne({ email })
    if (exitedUser) {
        throw new ApiError(409, 'The provided email address is already registered. Please use a different email.')
    }
    if (!req.files?.avatar?.tempFilePath) {
        throw new ApiError(400, 'Avatar image is required for registration.');
    }
    const avatar = await uploadOnCloudinary(req.files.avatar.tempFilePath);
    if (!avatar) {
        throw new ApiError(500, 'Failed to upload avatar image to the server. Please try again later.');
    }
    const newUser = await User.create({
        fullName,
        email,
        phone,
        aboutMe,
        password,
        instagramUrl,
        avatar: {
            public_id: avatar?.public_id,
            url: avatar?.secure_url
        }
    })
    const createdUser = await User.findById(newUser._id).select('-password')
    if (!createdUser) throw new ApiError(500, 'User creation was successful, but the user could not be retrieved. Please check the database.');
    generateToken(createdUser, 'User registered successfully.', 200, res)
})

// 😃😐😎 Login user
export const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        throw new ApiError(400, 'email and password are required to log in.')
    }
    const user = await User.findOne({ email }).select('+password');
    if (!user) throw new ApiError(404, 'No account found with the provided email address.');

    const isPasswordValid = await user.isPasswordCorrect(password)
    if (!isPasswordValid) {
        throw new ApiError(401, 'The provided password is incorrect. Please try again.')
    }
    const safeUser = await User.findById(user._id).select('-password');
    generateToken(safeUser, 'Logged in successfully', 200, res)
})

// 😃😐😎 Logout user
export const logout = asyncHandler(async (req, res) => {
    res.status(200)
        .cookie('token', '', {
            expires: new Date(Date.now()),
            httpOnly: true,
            sameSite: 'None',
            secure: true
        })
        .json({
            success: true,
            message: 'You have been logged out successfully.'
        })
})

// 😃😐😎 Get user
export const getUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) throw new ApiError(404, 'The requested user profile could not be found.');
    res.status(200)
        .json({
            success: true,
            message: 'User profile retrieved successfully.',
            user
        })
})

// 😃😐😎 Update user profile
export const updateProfile = asyncHandler(async (req, res) => {
    const { fullName, email, phone, aboutMe, instagramUrl } = req.body;
    const newData = { fullName, email, phone, aboutMe, instagramUrl };

    const user = await User.findById(req.user.id)
    if (!user) throw new ApiError(404, 'The user profile to update could not be found.');

    if (req.files?.avatar?.tempFilePath) {
        if (user.avatar?.public_id) {
            await cloudinary.uploader.destroy(user.avatar.public_id);
        }

        const newAvatar = await uploadOnCloudinary(req.files.avatar.tempFilePath);
        if (!newAvatar) throw new ApiError(500, 'Failed to upload the new avatar image. Please try again.');

        newData.avatar = {
            public_id: newAvatar.public_id,
            url: newAvatar.secure_url
        };
    }
    const updatedUser = await User.findByIdAndUpdate(user._id, newData, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    }).select('-password');

    res.status(200)
        .json({
            success: true,
            message: 'User profile updated successfully.',
            updatedUser
        })
})

// 😃😐😎 Update user password
export const updatePassword = asyncHandler(async (req, res) => {
    const { currentPassword, newPassword, confirmNewPassword } = req.body;
    if (!currentPassword || !newPassword || !confirmNewPassword) {
        throw new ApiError(400, 'All password fields are required');
    }

    const user = await User.findById(req.user.id).select('+password')
    if (!user) {
        throw new ApiError(400, 'The user account to update the password could not be found.')
    }
    const isMatch = await user.isPasswordCorrect(currentPassword);
    if (!isMatch) {
        throw new ApiError(401, 'The current password provided is incorrect.');
    }
    if (newPassword !== confirmNewPassword) {
        throw new ApiError(400, 'New password and confirm password do not match');
    }
    const isSameAsOld = await user.isPasswordCorrect(newPassword);
    if (isSameAsOld) {
        throw new ApiError(400, 'New password must be different from current password');
    }
    user.password = newPassword;
    await user.save()
    res.status(200)
        .json({
            success: true,
            message: 'password updated successfully.'
        })
})

// 😃😐😎 forgot password
export const forgotPassword = asyncHandler(async (req, res) => {
    const user = await User.findOne({ email: req.body.email })
    if (!user) {
        throw new ApiError(400, 'No account found with the provided email address. Please check and try again.')
    }
    const resetToken = await user.getResetPasswordToken()
    await user.save({ validateBeforeSave: false })
    const resetPasswordUrl = `${process.env.DASHBOARD_URL}/password/reset/${resetToken}`
    const message = `your reset password token is:- \n\n ${resetPasswordUrl} \n\n if you've not request for this kindly ignore it`
    try {
        await forgotPasswordEmail({
            email: user.email,
            subject: 'Password Recovery - Dashboard',
            message
        })
        res.status(200)
            .json({
                success: true,
                message: `Password reset email sent successfully to ${user.email}`
            })
    } catch (error) {
        user.resetPasswordTokenExpire = undefined,
            user.resetPasswordToken = undefined,
            await user.save()
        throw new ApiError(500, error.message || 'Failed to send password reset email. Please try again later.')
    }
})

// 😃😐😎 reset password
export const resetPassword = asyncHandler(async (req, res) => {
    const { token } = req.params;
    const resetPasswordToken = crypto.createHash('sha256')
        .update(token)
        .digest('hex')
    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordTokenExpire: { $gt: Date.now() }
    })
    if (!user) {
        throw new ApiError(400, 'The reset password token is invalid or has been expired.')
    }
    if (req.body.password !== req.body.confirmPassword) {
        throw new ApiError(400, 'password and confirm password do not match')
    }
    user.password = req.body.password,
        user.resetPasswordToken = undefined,
        user.resetPasswordTokenExpire = undefined
    await user.save()
    generateToken(user, 'Password reset successfully', 200, res)
})