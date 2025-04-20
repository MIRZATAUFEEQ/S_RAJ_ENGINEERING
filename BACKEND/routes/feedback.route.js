import express from 'express'
import { addFeedback, deleteFeedback, getAllFeedback, getSingleFeedback } from '../controllers/feedback.controller.js'
import { isAuthenticated } from '../middlewares/auth.middleware.js'
const router = express.Router()

router.route('/add').post(addFeedback)
router.route('/getAll').get(getAllFeedback)
router.route('/getSingle/:id').get(getSingleFeedback)
router.route('/delete/:id').delete(isAuthenticated, deleteFeedback)

export default router