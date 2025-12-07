import { Router } from 'express'
import { IssuesController } from '../controllers/issues.controller.js'
import { authenticate } from '../middleware/authMiddleware.js'

const router = Router()
router.post('/', authenticate, IssuesController.report)
export default router
