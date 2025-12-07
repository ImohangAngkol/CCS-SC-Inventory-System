import { Router } from 'express'
import { ItemsController } from '../controllers/items.controller.js'
import { authenticate } from '../middleware/authMiddleware.js'
import { allowRoles } from '../middleware/roleMiddleware.js'

const router = Router()

router.get('/', authenticate, ItemsController.list)
router.post('/', authenticate, allowRoles('officer'), ItemsController.create)
router.delete('/:id', authenticate, allowRoles('officer'), ItemsController.remove)

export default router
