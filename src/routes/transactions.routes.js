import { Router } from 'express'
import { TransactionsController } from '../controllers/transactions.controller.js'
import { authenticate } from '../middleware/authMiddleware.js'

const router = Router()

router.post('/borrow', authenticate, TransactionsController.borrow)
router.post('/reserve', authenticate, TransactionsController.reserve)

export default router
