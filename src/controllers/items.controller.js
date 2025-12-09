import { ItemsService } from '../services/items.service.js'

export const ItemsController = {
  async list(req, res) {
    try {
      const data = await ItemsService.list()
      res.json(data)
    } catch (e) {
      res.status(400).json({ message: e.message })
    }
  },
  async create(req, res) {
    try {
      const { name, description, category, total_quantity } = req.body
      if (!name || !total_quantity) return res.status(400).json({ message: 'Name and total_quantity required' })
      const item = await ItemsService.create({ name, description, category, total_quantity })
      res.status(201).json(item)
    } catch (e) {
      res.status(400).json({ message: e.message })
    }
  },
  async remove(req, res) {
    try {
      await ItemsService.remove(req.params.id)
      res.json({ success: true })
    } catch (e) {
      res.status(400).json({ message: e.message })
    }
  }
}
