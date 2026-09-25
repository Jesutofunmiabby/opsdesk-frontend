import { useEffect, useState } from 'react'

// Fetches a URL once and reports the outcome as a single status:
// 'loading' | 'success' | 'empty' | 'error'.
//
// selectList pulls the list out of the response body, because APIs wrap their
// data differently. It must be defined outside the calling component (or
// memoised), since a new function on every render would restart the request.
//
// Returns { data, status, retry }. retry() runs the request again.
export function useFetch(url, selectList) {
  const [status, setStatus] = useState('loading')
  const [data, setData] = useState([])
  // Bumped by retry(). It is a dependency of the effect, so changing it runs
  // the fetch again.
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    // Set if this effect is cleaned up before the request finishes, so a late
    // response cannot set state for a component that has moved on.
    let ignore = false

    async function load() {
      setStatus('loading')
      try {
        const response = await fetch(url)
        // fetch only rejects on network failure, so a 404 or 500 arrives here
        // as a normal response and has to be turned into an error by hand.
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`)
        }
        const body = await response.json()
        if (ignore) {
          return
        }
        const list = selectList(body)
        setData(list)
        setStatus(list.length > 0 ? 'success' : 'empty')
      } catch {
        if (ignore) {
          return
        }
        setStatus('error')
      }
    }

    load()

    return () => {
      ignore = true
    }
  }, [url, selectList, attempt])

  function retry() {
    setAttempt((current) => current + 1)
  }

  return { data, status, retry }
}
