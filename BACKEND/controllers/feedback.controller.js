import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiError } from '../utils/ApiError.js'
import { uploadOnCloudinary } from '../config/cloudinary.js';
import { Feedback } from '../models/feedback.model.js'
import { v2 as cloudinary } from 'cloudinary'

export const addFeedback = asyncHandler(async (req, res) => {
    const { fullName, address, message } = req.body;
    if (!fullName || !address || !message) {
        throw new ApiError(400, 'All fields are required')
    }
    if (!req.files?.coverImage?.tempFilePath) {
        throw new ApiError(400, 'Cover Image are required')
    }
    const coverImage = await uploadOnCloudinary(req.files?.coverImage?.tempFilePath)
    if (!coverImage) {
        throw new ApiError(400, 'Failed to upload cover image on server')
    }
    const feedback = await Feedback.create({
        fullName,
        address,
        message,
        coverImage: {
            public_id: coverImage?.public_id,
            url: coverImage?.secure_url
        }
    })
    res.status(200)
        .json({
            success: true,
            message: 'Review submited successfully',
            feedback
        })
})

export const getAllFeedback = asyncHandler(async (req, res) => {
    const feedback = await Feedback.find({}).sort({ createdAt: -1 })
    res.status(200)
        .json({
            success: true,
            message: 'All feedback fetched successfully',
            feedback
        })
})

export const getSingleFeedback = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const feedback = await Feedback.findById(id);
    if (!feedback) {
        throw new ApiError(400, 'Feedback not found')
    }
    res.status(200)
        .json({
            success: true,
            message: 'Feedback fetched successfully',
            feedback
        })
})

export const deleteFeedback = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const feedback = await Feedback.findById(id)
    if (!feedback) {
        ApiError(400, 'Feedback id not found')
    }
    await cloudinary.uploader.destroy(feedback.coverImage.public_id)
    await feedback.deleteOne()
    res.status(200)
        .json({
            success: true,
            message: 'Feedback deleted successfully'
        })
})