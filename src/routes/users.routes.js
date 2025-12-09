import { Router } from 'express'
import { UsersController } from '../controllers/users.controller.js'
import { authenticate } from '../middleware/authMiddleware.js'
import { allowRoles } from '../middleware/roleMiddleware.js'

const router = Router()

router.get('/', authenticate, allowRoles('officer'), UsersController.list)
router.post('/', authenticate, allowRoles('officer'), UsersController.create)
router.patch('/:id/role', authenticate, allowRoles('officer'), UsersController.setRole)

export default router
