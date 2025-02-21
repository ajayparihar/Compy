import { useEffect } from 'react'
import { useLocalStorage } from './useLocalStorage'

export function useTheme() {
  const [theme, setTheme] = useLocalStorage('theme', 'light')

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  return { theme, setTheme }
} 