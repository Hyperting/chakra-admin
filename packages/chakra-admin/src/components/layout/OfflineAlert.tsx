import React, { FC } from 'react'
import { useNavigatorOnline } from '@oieduardorabelo/use-navigator-online'
import { AnimatePresence } from 'framer-motion/dist/framer-motion'
import { BoxProps } from '@chakra-ui/react'
import { MotionBox } from '../base/motion'

type Props = {
  //
} & BoxProps

export const OfflineAlert: FC<Props> = (props) => {
  const { isOffline } = useNavigatorOnline()

  return (
    <AnimatePresence initial={false}>
      {isOffline && (
        <MotionBox
          position="absolute"
          left="0px"
          right="0px"
          // top="0px"
          h="18px"
          bgColor="red.500"
          color="white"
          fontSize="smaller"
          textAlign="center"
          animate="open"
          exit="close"
          initial="close"
          {...({ transition: { duration: 0.1 } } as any)}
          // style={{ originY: 1 }}
          variants={{
            open: { y: 0, height: 'auto' },
            close: { y: '-20px', height: 0 },
          }}
          {...props}
        >
          Connessione assente
        </MotionBox>
      )}
    </AnimatePresence>
  )
}
