import React, { FC } from 'react'
import { Icon, ThemingProps, Text, ColorProps, BoxProps, Box } from '@chakra-ui/react'
import { FaCircle } from 'react-icons/fa'

type Props = {
  statusColor?: ColorProps['color']
  textColorScheme?: ThemingProps<'Text'>['colorScheme']
  textColor?: ColorProps['color']
  label?: string
  value: string
} & BoxProps

export const StatusField: FC<Props> = ({
  statusColor,
  value,
  textColor,
  textColorScheme,
  ...rest
}) => {
  return (
    <Box display="inline-flex" alignItems="baseline" {...rest}>
      <Icon as={FaCircle} fontSize="xx-small" color={statusColor} />
      <Text fontSize="sm" ml={2} color={textColor} colorScheme={textColorScheme}>
        {value}
      </Text>
    </Box>
  )
}
