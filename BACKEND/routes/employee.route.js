import { addEmployee, deleteEmployee } from '../controllers/employee.controller.js'
import { isAuthenticated } from '../middlewares/auth.middleware.js'
import express from 'express'
const router = express.Router()

router.route('/add').post(isAuthenticated, addEmployee)
router.route('/delete/:id').delete(isAuthenticated, deleteEmployee)

export default router