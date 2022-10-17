import React, { FC, ReactNode } from 'react'
import { Box, BoxProps, DrawerBody, Flex } from '@chakra-ui/react'
import { PageTitle } from './PageTitle'

export type PageLayoutProps = {
  title?: ReactNode
  topToolbar?: ReactNode
  renderingInModal?: boolean
} & BoxProps

export const PageLayout: FC<PageLayoutProps> = ({
  children,
  renderingInModal,
  title = <PageTitle />,
  topToolbar,
  ...rest
}) => {
  //   const chechScroll = Object.keys(rest).length === 0
  if (renderingInModal) {
    return (
      <>
        {typeof title === 'string' ? <PageTitle label={title} renderingInModal={renderingInModal} /> : title || null}
        <DrawerBody {...rest}>{children}</DrawerBody>
      </>
    )
  }

  return (
    <Box pr={{ base: 5, lg: '64px' }} {...rest}>
      <Flex
        w="100%"
        pt={{ base: 0, lg: 6 }}
        pb={5}
        pl={{ base: 5, lg: 0 }}
        justifyContent="space-between"
        // position={chechScroll ? 'sticky' : 'relative'}
        // top={0}
        // top={isMobile ? '-25px' : 0}
        // bgColor="gray.50"
        // border={chechScroll ? '2px solid red' : '2px solid blue'}
      >
        {typeof title === 'string' ? <PageTitle label={title} renderingInModal={renderingInModal} /> : title || null}
        {topToolbar}
      </Flex>
      {children}
    </Box>
  )
}
