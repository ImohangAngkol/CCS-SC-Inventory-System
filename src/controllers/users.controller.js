import { UsersService } from '../services/users.service.js'
import bcrypt from 'bcryptjs'

export const UsersController = {
  async list(req, res) {
    try {
      const data = await UsersService.list()
      res.json(data)
    } catch (e) {
      res.status(400).json({ message: e.message })
    }
  },
  async create(req, res) {
    try {
      const { email, full_name, role, password } = req.body
      if (!email || !password) return res.status(400).json({ message: 'Email and password required' })
      const hash = await bcrypt.hash(password, 10)
      const data = await UsersService.create({ email, full_name, role, password_hash: hash })
      res.status(201).json(data)
    } catch (e) {
      res.status(400).json({ message: e.message })
    }
  },
  async setRole(req, res) {
    try {
      const { role } = req.body
      const data = await UsersService.setRole(req.params.id, role)
      res.json(data)
    } catch (e) {
      res.status(400).json({ message: e.message })
    }
  }
}
