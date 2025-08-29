import { useCallback, useRef } from 'react'

/**
 * Debounces a function call, ensuring it's only executed after a specified delay
 * has passed since the last invocation. Subsequent calls within the delay period
 * will reset the timer and cancel the previous pending execution.
 *
 * @param fn - Function to be debounced. This should be a stable identifier,
 * e.g. returned from useCallback.
 * @param delay - Delay in milliseconds before the function is executed
 * @returns Debounced version of the function that can be called normally
 */
export default function useDebounce<Args extends Array<unknown>, R>(
  fn: (...args: Args) => R,
  delay: number,
): (...args: Args) => void {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  return useCallback(
    (...args: Args): void => {
      // Clear existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      // Set new timeout
      timeoutRef.current = setTimeout(() => {
        fn(...args)
      }, delay)
    },
    [fn, delay],
  )
}
