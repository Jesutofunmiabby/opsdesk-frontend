import { useEffect, useState } from 'react'

// Where a request has got to. 'empty' means it worked but the list was empty.
export type FetchStatus = 'loading' | 'success' | 'empty' | 'error'

// What useFetch hands back. T is the type of one item in the list, such as
// User, so the same hook works for any kind of list.
export interface FetchResult<T> {
  data: T[]
  status: FetchStatus
  retry: () => void
}

// Fetches a URL once and reports the outcome as a single FetchStatus.
//
// selectList pulls the list out of the response body, because APIs wrap their
// data differently. It is given the body as unknown, because nothing about
// the response has been checked yet, and must return a list of T. It must be
// defined outside the calling component (or memoised), since a new function
// on every render would restart the request.
//
// Returns { data, status, retry }. retry() runs the request again.
export function useFetch<T>(
  url: string,
  selectList: (body: unknown) => T[],
): FetchResult<T> {
  const [status, setStatus] = useState<FetchStatus>('loading')
  const [data, setData] = useState<T[]>([])
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
        // json() is typed as any. Storing it as unknown means it has to be
        // checked (by selectList) before anything can use it.
        const body: unknown = await response.json()
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
