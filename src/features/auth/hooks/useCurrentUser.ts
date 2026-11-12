import { useGetMeQuery } from '../../../store/authApi'
import { selectIsSignedIn } from '../../../store/authSlice'
import { useAppSelector } from '../../../store/hooks'

// The signed-in user from GET /auth/me, including their role, or undefined
// while it loads or when no one is signed in. Every component that asks
// shares one cached request.
export function useCurrentUser() {
  const isSignedIn = useAppSelector(selectIsSignedIn)
  return useGetMeQuery(undefined, { skip: !isSignedIn })
}
