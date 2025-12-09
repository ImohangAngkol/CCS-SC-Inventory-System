import { TransactionsService } from '../services/transactions.service.js'

export const TransactionsController = {
  async borrow(req, res) {
    try {
      const { itemId, quantity } = req.body
      const tx = await TransactionsService.borrow(req.user.sub, { itemId, quantity })
      res.status(201).json(tx)
    } catch (e) {
      res.status(400).json({ message: e.message })
    }
  },
  async reserve(req, res) {
    try {
      const { itemId, quantity, reservedDate } = req.body
      const tx = await TransactionsService.reserve(req.user.sub, { itemId, quantity, reservedDate })
      res.status(201).json(tx)
    } catch (e) {
      res.status(400).json({ message: e.message })
    }
  }
}
