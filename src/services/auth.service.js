import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { supabase } from '../config/supabase.js'
import dotenv from 'dotenv'
dotenv.config()

const signToken = (user) => {
  return jwt.sign(
    { sub: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES }
  )
}

const signRefresh = (user) => {
  return jwt.sign(
    { sub: user.id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES }
  )
}

export const AuthService = {
  async register({ email, password, full_name, role }) {
    const { data: existing } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .maybeSingle()

    if (existing) throw new Error('Email already exists')

    const hash = await bcrypt.hash(password, 10)
    const { data, error } = await supabase
      .from('users')
      .insert([{ email, password_hash: hash, full_name, role }])
      .select('*')
      .single()
    if (error) throw new Error(error.message)
    return data
  },

  async login({ email, password }) {
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single()
    if (error || !user) throw new Error('Invalid credentials')

    const ok = await bcrypt.compare(password, user.password_hash)
    if (!ok) throw new Error('Invalid credentials')

    const token = signToken(user)
    const refresh = signRefresh(user)
    return { token, refresh, user: { id: user.id, email: user.email, role: user.role } }
  },

  async refresh(refreshToken) {
    try {
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET)
      const { data: user } = await supabase
        .from('users')
        .select('*')
        .eq('id', decoded.sub)
        .single()
      if (!user) throw new Error('User not found')
      const token = signToken(user)
      return { token }
    } catch {
      throw new Error('Invalid refresh token')
    }
  }
}
