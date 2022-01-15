import {
  atom,
  useRecoilState,
  useRecoilValue,
  useResetRecoilState,
  useSetRecoilState,
} from 'recoil'
import { RouteAvailability } from './RouteAvailability'

export const ADMIN_STATE_KEY = 'adminState'

export interface RegisteredResources {
  [key: string]: RouteAvailability
}

export interface AdminState {
  registeredResources: RegisteredResources
  initialized: boolean
}

export const authState = atom<AdminState>({
  key: ADMIN_STATE_KEY,
  default: {
    registeredResources: {},
    initialized: false,
  },
})

export const useAdminState = () => useRecoilState(authState)
export const useAdminStateValue = () => useRecoilValue(authState)
export const useSetAdminState = () => useSetRecoilState(authState)
export const useResetAdminState = () => useResetRecoilState(authState)
