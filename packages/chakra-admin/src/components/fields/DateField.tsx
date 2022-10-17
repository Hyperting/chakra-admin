import React, { FC, useMemo } from 'react'
import { Text, TextProps } from '@chakra-ui/react'

type Props = {
  value?: string
  locales?: string | string[]
  intlOptions?: Intl.DateTimeFormatOptions
} & TextProps

export const DateField: FC<Props> = ({ value, locales, intlOptions, ...rest }) => {
  const formattedDate = useMemo(() => {
    const date = new Date(value!)
    return Intl.DateTimeFormat(locales, intlOptions).format(date)
  }, [intlOptions, locales, value])

  return (
    <Text as="span" {...rest}>
      {formattedDate}
    </Text>
  )
}
