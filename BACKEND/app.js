import dotenv from 'dotenv'
dotenv.config({
    path: './.env'
})
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import fileUpload from 'express-fileupload'
import { errorMiddleware } from './middlewares/errorHandler.middleware.js'
import userRoute from './routes/user.route.js'
import os from 'os'
import path from 'path'
import { requestLogger } from './middlewares/requestLogger.js'
import feedbackRoute from './routes/feedback.route.js'
import employeeRoute from './routes/employee.route.js';
const app = express()

app.use(cors({
    origin: [process.env.FRONTEND_URL, process.env.ADMIN_URL],
    methods: ['GET', 'POST', 'DELETE', 'PUT'],
    credentials: true
}))

app.use(cookieParser())
app.use(requestLogger)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const tempDir = path.join(os.tmpdir(), 'uploads')
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: tempDir
}))

app.use('/api/v1/auth', userRoute)
app.use('/api/v1/feedback', feedbackRoute)
app.use('/api/v1/employee', employeeRoute)

app.use(errorMiddleware)
export { app }