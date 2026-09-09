import { useEffect } from 'react'
import { useUser } from '../context/UserContext'
import { applyTheme } from '../utils/js/applyTheme.js'

const ThemeSync = () => {
  const { settings, userLoading } = useUser()

  useEffect(() => {
    if (!userLoading && (settings?.theme === 'LIGHT' || settings?.theme === 'DARK')) {
      applyTheme(settings.theme)
    }
  }, [userLoading, settings])

  return null
}

export default ThemeSync