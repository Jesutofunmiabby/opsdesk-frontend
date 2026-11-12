import { createApi } from '@reduxjs/toolkit/query/react'
import type {
  AuthResponse,
  LoginValues,
  RegisterValues,
} from '../features/auth/types'
import type { User } from '../features/users/types'
import { baseQueryWithAuth } from './baseQuery'

// The auth endpoints (see "Auth" in API_CONTRACT.md). The signed-in user
// from GET /auth/me is server data, so it is cached here by RTK Query like
// tickets are, not copied into a slice of ours.
export const authApi = createApi({
  // Where the cache sits in the store: state.authApi.
  reducerPath: 'authApi',
  baseQuery: baseQueryWithAuth,

  endpoints: (build) => ({
    // Named "login" on purpose: baseQueryWithAuth does not end the session
    // on a 401 from this endpoint, which just means a wrong password.
    login: build.mutation<AuthResponse, LoginValues>({
      query: (values) => ({ url: '/auth/login', method: 'POST', body: values }),
    }),

    register: build.mutation<AuthResponse, RegisterValues>({
      query: (values) => ({
        url: '/auth/register',
        method: 'POST',
        body: values,
      }),
    }),

    // Who the token belongs to, including their role. Fetched by the
    // protected pages once someone has a token, after login or a refresh.
    getMe: build.query<User, void>({
      query: () => '/auth/me',
    }),
  }),
})

export const { useLoginMutation, useRegisterMutation, useGetMeQuery } = authApi
