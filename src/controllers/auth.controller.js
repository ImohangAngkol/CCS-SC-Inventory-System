import { AuthService } from '../services/auth.service.js'
import bcrypt from 'bcryptjs'

export const AuthController = {
  async register(req, res) {
    try {
      const { email, password, full_name, role } = req.body
      if (!email || !password) return res.status(400).json({ message: 'Email and password required' })
      const data = await AuthService.register({ email, password, full_name, role })
      return res.status(201).json({ message: 'Registered', user: { id: data.id, email: data.email, role: data.role } })
    } catch (e) {
      return res.status(400).json({ message: e.message })
    }
  },
  async login(req, res) {
    try {
      const { email, password } = req.body
      const data = await AuthService.login({ email, password })
      return res.json(data)
    } catch (e) {
      return res.status(401).json({ message: e.message })
    }
  },
  async refresh(req, res) {
    try {
      const { refreshToken } = req.body
      const data = await AuthService.refresh(refreshToken)
      return res.json(data)
    } catch (e) {
      return res.status(401).json({ message: e.message })
    }
  }
}
