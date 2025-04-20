import mongoose from 'mongoose'

const employeeSchema = new mongoose.Schema({
    employeeName: {
        type: String,
        required: [true, 'Employee full name is required']
    },
    aboutEmployee: {
        type: String,
        required: [true, 'About employee is required']
    },
    employeeContact: {
        type: String,
        required: [true, 'employee contact detail is required']
    },
    employeeAvatar: {
        public_id: String,
        url: String,
    },
    experience: {
        from: {
            type: Date,
        },
        to: {
            type: Date,
            default: Date.now
        }
    }
}, { timestamps: true })

export const Employee = mongoose.model('Employee', employeeSchema)