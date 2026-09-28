import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'

export type Theme = 'day' | 'night'

const STORAGE_KEY = 'itology-theme'

const ThemeContext = createContext<{
  theme: Theme
  isDay: boolean
  toggle: () => void
} | null>(null)

function readTheme(): Theme {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === 'day' || stored === 'night') return stored
  } catch {
    /* private mode */
  }
  return 'night'
}

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme
  const meta = document.querySelector('meta[name="theme-color"]')
  if (meta) meta.setAttribute('content', theme === 'day' ? '#f2f4f7' : '#000000')
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(readTheme)

  useEffect(() => {
    applyTheme(theme)
    try {
      localStorage.setItem(STORAGE_KEY, theme)
    } catch {
      /* private mode */
    }
  }, [theme])

  const toggle = useCallback(() => {
    setTheme((current) => (current === 'day' ? 'night' : 'day'))
  }, [])

  return (
    <ThemeContext.Provider value={{ theme, isDay: theme === 'day', toggle }}>
      {children}
    </ThemeContext.Provider>
  )
}

export default function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) throw new Error('useTheme must be used within ThemeProvider')
  return context
}
