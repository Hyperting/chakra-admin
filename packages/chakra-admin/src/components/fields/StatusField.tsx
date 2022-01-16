import React, { useMemo } from 'react'
import { Icon, ThemingProps, Text, ColorProps, BoxProps, Box } from '@chakra-ui/react'
import { FaCircle } from 'react-icons/fa'
import get from 'lodash.get'
import { CAFieldProps, caField } from '../../core/react/system'
import { useField } from '../../core/fields/useField'

export type StatusOptions = {
  statusColor?: ColorProps['color']
  textColorScheme?: ThemingProps<'Text'>['colorScheme']
  textColor?: ColorProps['color']
  label?: React.ReactNode | ((props: CAFieldProps) => React.ReactNode)
}

export type StatusFieldProps<TItem> = {
  statuses?: Record<string | number, StatusOptions>
  getStatus?: (props: Partial<CAFieldProps<TItem>>) => string | number
} & Partial<CAFieldProps<TItem>> &
  BoxProps

export function StatusField<TItem = Record<string, any>>({
  statuses = {},
  record,
  source,
  getStatus,
  ...rest
}: StatusFieldProps<TItem>) {
  const value = useMemo(() => {
    if (getStatus) {
      return getStatus({ record, source })
    }

    return get(record || {}, source)
  }, [getStatus, record, source])

  const statusOptions = useMemo(() => {
    return statuses[value] || {}
  }, [statuses, value])

  console.log(value, statusOptions)

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
