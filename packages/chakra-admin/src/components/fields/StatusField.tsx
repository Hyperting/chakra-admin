import React, { useMemo } from 'react'
import { Icon, ThemingProps, Text, ColorProps, BoxProps, Box } from '@chakra-ui/react'
import { FaCircle } from 'react-icons/fa'
import get from 'lodash.get'
import { CAFieldProps } from '../../core/react/system-field'
import { useField } from '../../core/fields/useField'

export type StatusOptions = {
  statusColor?: ColorProps['color']
  textColorScheme?: ThemingProps<'Text'>['colorScheme']
  textColor?: ColorProps['color']
  label?: React.ReactNode
}

export type StatusFieldProps<TItem extends object> = {
  statuses?: Record<string | number, StatusOptions>
} & Partial<CAFieldProps<BoxProps, TItem>> &
  BoxProps

export function StatusField<TItem extends object = Record<string, any>>({
  statuses = {},
  ...rest
}: StatusFieldProps<TItem>) {
  const value = useField<TItem>(rest as any)

  const statusOptions = useMemo(() => {
    return statuses[value] || {}
  }, [statuses, value])

  return (
    <Box display="inline-flex" alignItems="baseline" {...rest}>
      <Icon as={FaCircle} fontSize="xx-small" color={statusOptions?.statusColor} />
      <Text
        fontSize="sm"
        ml={2}
        color={statusOptions?.textColor}
        colorScheme={statusOptions?.textColorScheme}
      >
        {statusOptions?.label || JSON.stringify(value)}
      </Text>
    </Box>
  )
}
