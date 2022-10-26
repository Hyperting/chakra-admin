/* eslint-disable import/no-extraneous-dependencies */
import { ChakraProps } from '@chakra-ui/react'
import { keys } from 'ts-transformer-keys/index'

export const chakraProps = keys<ChakraProps>()

export function filterChakraProps<P = {}>(props: P): P {
  return Object.keys(props as unknown as any).reduce((acc, key) => {
    if (key === 'ref') {
      return acc
    }

    if (key === 'variant') {
      return acc
    }

    if (key.indexOf('aria-') !== -1) {
      return acc
    }

    if (chakraProps.includes(key as unknown as keyof ChakraProps)) {
      return acc
    }

    return {
      ...acc,
      [key]: (props as any)[key],
    }
  }, {}) as P
}
