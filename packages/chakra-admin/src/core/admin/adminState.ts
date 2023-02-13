import React from 'react'
import { atom, useRecoilState, useRecoilValue, useResetRecoilState, useSetRecoilState } from 'recoil'
import { RouteAvailability } from './RouteAvailability'

export const ADMIN_STATE_KEY = 'adminState'

export const registeredIcons: Record<string, React.ReactNode> = {}

export interface RegisteredResources {
  [key: string]: RouteAvailability & { iconName: string }
}

export interface AdminState {
  registeredResources: RegisteredResources
  initialized: boolean
}

export const adminState = atom<AdminState>({
  key: ADMIN_STATE_KEY,
  default: {
    registeredResources: {},
    initialized: false,
  },
})

export const useAdminState = () => useRecoilState(adminState)
export const useAdminStateValue = () => useRecoilValue(adminState)
export const useSetAdminState = () => useSetRecoilState(adminState)
export const useResetAdminState = () => useResetRecoilState(adminState)
