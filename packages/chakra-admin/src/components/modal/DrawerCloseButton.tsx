/* eslint-disable no-underscore-dangle */
import React, { useMemo } from 'react'
import { forwardRef, IconButton, IconButtonProps, useModalContext } from '@chakra-ui/react'
import { callAllHandlers } from '@chakra-ui/utils'
import { MdClose } from 'react-icons/md'

export const DrawerCloseButton = forwardRef<
  IconButtonProps & { drawerPlacement?: 'left' | 'right'; icon?: React.ReactNode },
  'button'
>((props, ref) => {
  const { onClick, drawerPlacement = 'right', icon = <MdClose />, ...rest } = props
  const buttonPosition = useMemo(() => {
    if (drawerPlacement === 'right') {
      return { left: '-22px' }
    } else {
      return { right: '-22px' }
    }
  }, [drawerPlacement])
  const { onClose } = useModalContext()

  return (
    <IconButton
      w="44px"
      h="44px"
      pos="absolute"
      top="50px"
      {...buttonPosition}
      icon={icon}
      color="white"
      fontSize="24px"
      backgroundColor="gray.600"
      onClick={callAllHandlers(onClick, ((event: MouseEvent) => {
        event.stopPropagation()
        onClose()
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      }) as any)}
      {...rest}
    />
  )
})
