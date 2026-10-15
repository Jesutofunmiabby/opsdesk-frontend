import { useEffect, useState } from 'react'

// The value, but only once it has stopped changing for delayMs. While someone
// types in a search box, this stays on the last pause, so a request goes out
// when they stop typing rather than on every key press.
export function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [settled, setSettled] = useState(value)

  // Each change starts a new timer and the cleanup cancels the old one, so
  // only a value that lasts the full delay gets through.
  useEffect(() => {
    const timer = setTimeout(() => setSettled(value), delayMs)
    return () => clearTimeout(timer)
  }, [value, delayMs])

  return settled
}
