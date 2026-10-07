import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from './store'

// Use these instead of the plain useDispatch and useSelector. They already
// know the store's types, so selectors get RootState and dispatch only takes
// this store's actions, with no types to repeat in every component.
export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()
