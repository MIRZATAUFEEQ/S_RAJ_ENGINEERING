import mongoose from 'mongoose'

const feedbackSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: [true, 'fullName is required']
    },
    address: {
        type: String,
        required: [true, 'address is required']
    },
    message: {
        type: String,
        required: [true, 'message is required']
    },
    coverImage: {
        public_id: {
            type: String,
            required: [true, 'coverImage is required']
        },
        url: {
            type: String,
            required: [true, 'url is required']
        }
    }

}, { timestamps: true })

export const Feedback = mongoose.model('Feedback', feedbackSchema)