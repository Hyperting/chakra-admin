import { useCallback } from 'react'
import { Container } from 'typedi'
import { ClassType } from '../ClassType'
import { GlobalStrategy } from './Strategy'

export const TOKEN_GLOBAL_STRATEGY = 'chakra-admin_GlobalStrategy'

type SetGlobalStrategyFunction = (newValue: ClassType<GlobalStrategy> | undefined) => void

export const useGlobalStrategy = (): GlobalStrategy | undefined => {
  if (Container.has(TOKEN_GLOBAL_STRATEGY)) {
    return Container.get<GlobalStrategy>(TOKEN_GLOBAL_STRATEGY)
  }
}

export const useSetGlobalStrategy = (): SetGlobalStrategyFunction => {
  return useCallback((newValue: ClassType<GlobalStrategy> | undefined) => {
    // eslint-disable-next-line new-cap
    Container.set({ id: TOKEN_GLOBAL_STRATEGY, value: newValue ? new newValue() : undefined })
  }, [])
}
