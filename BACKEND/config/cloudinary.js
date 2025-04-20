import { v2 as cloudinary } from "cloudinary";
import fs from 'fs'
import dotenv from 'dotenv'
dotenv.config({
    path: './.env'
})
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

export const uploadOnCloudinary = async (avatar) => {
    try {
        if (!avatar) {
            return null
        }
        const response = cloudinary.uploader.upload(avatar, {
            folder: 'S_raj',
            resource_type: 'auto'
        })
        return response
    } catch (error) {
        console.error(error)
        if (fs.existsSync(avatar)) {
            fs.unlinkSync(avatar)
        }
        return null
    }
}