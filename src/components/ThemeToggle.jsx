import React from 'react'
import { useTheme } from '../context/ThemeContext'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  return (
    <button onClick={toggleTheme} style={{ padding: '0.5rem 1rem', borderRadius: 8, border: '1px solid var(--gray-300)' }}>
      {theme === 'light' ? 'Switch to Dark' : 'Switch to Light'}
    </button>
  )
}
