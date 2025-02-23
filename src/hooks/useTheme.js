import { useEffect, useState } from 'react'
import { useLocalStorage } from './useLocalStorage'
import { themes } from '../themes/themeConfig'

export function useTheme() {
  const [currentTheme, setCurrentTheme] = useLocalStorage('theme', 'sunrise')
  const [favoriteThemes, setFavoriteThemes] = useLocalStorage('favoriteThemes', [])
  const [themeVersion, setThemeVersion] = useState(0)

  const themeCategory = Object.entries(themes).find(([category, categoryThemes]) => 
    Object.keys(categoryThemes).includes(currentTheme)
  )?.[0] || 'light'

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', themeCategory)
    setThemeVersion(prev => prev + 1)
  }, [themeCategory, currentTheme])

  const toggleFavorite = (themeId) => {
    setFavoriteThemes(prev => 
      prev.includes(themeId)
        ? prev.filter(id => id !== themeId)
        : [...prev, themeId]
    )
  }

  const getThemeData = (themeId) => {
    const themeMap = Object.entries(themes).reduce((acc, [category, categoryThemes]) => {
      Object.entries(categoryThemes).forEach(([id, data]) => {
        acc[id] = { ...data, category };
      });
      return acc;
    }, {});
    return themeMap[themeId] || null;
  }

  return {
    currentTheme,
    setCurrentTheme: (theme) => {
      setCurrentTheme(theme)
      setThemeVersion(prev => prev + 1)
    },
    favoriteThemes,
    toggleFavorite,
    getThemeData,
    themes,
    themeVersion
  }
}