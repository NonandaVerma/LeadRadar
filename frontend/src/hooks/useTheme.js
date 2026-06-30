import { useState, useEffect } from 'react'

/**
 * useTheme — manages light/dark theme state.
 * Persists choice to localStorage, applies data-theme attribute to <html>.
 * Defaults to dark (your original design) on first visit.
 */
export function useTheme() {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('leadradar-theme')
    return saved || 'dark'
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('leadradar-theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark')
  }

  return { theme, toggleTheme }
}