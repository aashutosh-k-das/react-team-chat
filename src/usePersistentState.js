import { useEffect, useState } from 'react'

// useState that also saves to localStorage, so history survives a reload.
// If storage is blocked (private mode etc.) it just behaves like normal state.
export default function usePersistentState(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = localStorage.getItem(key)
      if (stored !== null) return JSON.parse(stored)
    } catch {
      // ignore unreadable storage
    }
    return typeof initialValue === 'function' ? initialValue() : initialValue
  })

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // ignore quota / unavailable storage
    }
  }, [key, value])

  return [value, setValue]
}
