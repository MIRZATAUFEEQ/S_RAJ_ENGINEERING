import { uploadOnCloudinary } from '../config/cloudinary.js'
import { Employee } from '../models/employee.model.js'
import { ApiError } from '../utils/ApiError.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { v2 as cloudinary } from 'cloudinary'

export const addEmployee = asyncHandler(async (req, res) => {
    const { employeeName, aboutEmployee, employeeContact, experience } = req.body
    if (!employeeName || !aboutEmployee || !experience || !employeeContact) {
        throw new ApiError(400, 'All fields are required')
    }
    if (!req.files?.employeeAvatar?.tempFilePath) {
        throw new ApiError(400, 'Employee avatar is required')
    }
    const avatar = await uploadOnCloudinary(req.files.employeeAvatar.tempFilePath)
    if (!avatar) {
        throw new ApiError(400, 'Failed to upload employee avatar on server')
    }

    const employee = await Employee.create({
        employeeName,
        aboutEmployee,
        employeeContact,
        experience,
        employeeAvatar: {
            public_id: avatar?.public_id,
            url: avatar?.secure_url
        }
    })
    res.status(200)
        .json({
            success: true,
            message: 'Employee successfully created',
            employee
        })
})

export const deleteEmployee = asyncHandler(async (req, res) => {
    const { id } = req.params
    const employee = await Employee.findById(id)
    if (!employee) {
        throw new ApiError(400, 'Employee not found')
    }
    await cloudinary.uploader.destroy(employee.employeeAvatar.public_id)
    await employee.deleteOne()
    res.status(200)
        .json({
            success: true,
            message: 'Employee deleted successfully'
        })
})