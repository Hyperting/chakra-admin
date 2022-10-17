import { atom } from 'recoil'
import { DefaultUserIdentity } from './AuthProvider'

export const AUTH_STATE_KEY = 'authState'

export interface AuthState<UserIdentity = DefaultUserIdentity> {
  isLoggedIn?: boolean
  authUser?: UserIdentity
}

export const authState = atom<AuthState>({
  key: AUTH_STATE_KEY,
  default: {
    isLoggedIn: false,
  },
})
