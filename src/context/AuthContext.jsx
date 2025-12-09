
import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../context/SupabaseClient'
import { jwtDecode } from 'jwt-decode'


const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)           // frontend user
  const [role, setRole] = useState(null)           // 'student' | 'officer'
  const [token, setToken] = useState(null)         // backend JWT
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const sessionToken = localStorage.getItem('scis_token')
    if (sessionToken) {
      try {
        const decoded = jwtDecode(sessionToken)
        setUser({ id: decoded.sub, email: decoded.email })
        setRole(decoded.role)
        setToken(sessionToken)
      } catch {}
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    // authenticate via backend to issue JWT tied to Supabase record
    const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.message || 'Login failed')

    localStorage.setItem('scis_token', data.token)
    setToken(data.token)
    setUser({ id: data.user.id, email: data.user.email })
    setRole(data.user.role)
  }

  const signup = async (payload) => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.message || 'Signup failed')
    return data
  }

  const logout = () => {
    localStorage.removeItem('scis_token')
    setUser(null)
    setRole(null)
    setToken(null)
  }

  return (
    <AuthContext.Provider value={{ user, role, token, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)


/*
const login = async (email, password) => {
  // Mock login: always succeed
  setUser({ id: '123', email })
  setRole(email.includes('officer') ? 'officer' : 'student')
  setToken('mock-token')
}

const signup = async (payload) => {
  // Mock signup: just log
  console.log('Mock signup', payload)
  return { success: true }
}
*/
