import { useEffect } from 'react'
import { useLocalStorage } from './useLocalStorage'
import { themes } from '../themes/themeConfig'

export function useTheme() {
  const [currentTheme, setCurrentTheme] = useLocalStorage('theme', 'sunrise')
  const [favoriteThemes, setFavoriteThemes] = useLocalStorage('favoriteThemes', [])

  const themeCategory = Object.entries(themes).find(([category, categoryThemes]) => 
    Object.keys(categoryThemes).includes(currentTheme)
  )?.[0] || 'light'

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', themeCategory)
  }, [themeCategory])

  const toggleFavorite = (themeId) => {
    setFavoriteThemes(prev => 
      prev.includes(themeId)
        ? prev.filter(id => id !== themeId)
        : [...prev, themeId]
    )
  }

  const getThemeData = (themeId) => {
    for (const [category, categoryThemes] of Object.entries(themes)) {
      if (themeId in categoryThemes) {
        return { ...categoryThemes[themeId], category }
      }
    }
    return null
  }

  return {
    currentTheme,
    setCurrentTheme,
    favoriteThemes,
    toggleFavorite,
    getThemeData,
    themes
  }
}