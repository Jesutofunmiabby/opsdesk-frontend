import { useAppDispatch } from '../store/hooks'
import { addNotification } from '../store/uiSlice'
import { getRequestErrorMessage } from '../utils/requestErrors'

// Gives a function that shows a failed request as an error toast, worded by
// getRequestErrorMessage: friendly for a 403, the API's own message for a
// 404 or a validation error, and the fallback when the server could not be
// reached. A 401 shows nothing, since the login page explains it.
export function useShowRequestError() {
  const dispatch = useAppDispatch()

  return function showRequestError(error: unknown, fallback: string) {
    const message = getRequestErrorMessage(error, fallback)
    if (message) {
      dispatch(addNotification({ message, type: 'error' }))
    }
  }
}
