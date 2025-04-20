import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import crypto from 'crypto'
import jwt from 'jsonwebtoken'
const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: [true, 'fullName is required']
    },
    email: {
        type: String,
        required: [true, 'email is required']
    },
    phone: {
        type: String,
        required: [true, 'phone is required']
    },
    aboutMe: {
        type: String,
        required: [true, 'about me is required']
    },
    password: {
        type: String,
        minLength: [8, 'password contain at least 8 character'],
        required: [true, 'password is required'],
        select: false
    },
    avatar: {
        public_id: {
            type: String,
            required: [true, 'avatar is required']
        },
        url: {
            type: String,
            required: [true, 'url is required']
        }
    },
    instagramUrl: String,
    resetPasswordToken: String,
    resetPasswordTokenExpire: Date,
}, { timestamps: true })

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next()
    }
    this.password = await bcrypt.hash(this.password, 10)
    next()
})
userSchema.methods.isPasswordCorrect = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
}

userSchema.methods.generateJsonWebToken = function () {
    return jwt.sign({ id: this._id },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRES
        }
    )
}

userSchema.methods.getResetPasswordToken = async function () {
    const resetToken = crypto.randomBytes(20).toString('hex')
    this.resetPasswordToken = crypto.createHash('sha256')
        .update(resetToken)
        .digest('hex')

    this.resetPasswordTokenExpire = Date.now() + 10 * 60 * 1000
    return resetToken
}

export const User = mongoose.model('User', userSchema)