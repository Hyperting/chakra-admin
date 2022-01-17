import React, { FC, ReactNode } from 'react'
import { Box, BoxProps, DrawerBody, Flex } from '@chakra-ui/react'
import { PageTitle } from './PageTitle'

export type PageContentProps = {
  title?: ReactNode
  topToolbar?: ReactNode
  bottomToolbar?: ReactNode
  renderingInModal?: boolean
} & BoxProps

export const PageContent: FC<PageContentProps> = ({
  children,
  renderingInModal,
  title = <PageTitle />,
  topToolbar,
  bottomToolbar,
  ...rest
}) => {
  if (renderingInModal) {
    return (
      <>
        {typeof title === 'string' ? (
          <PageTitle label={title} renderingInModal={renderingInModal} />
        ) : (
          title || null
        )}
        <DrawerBody {...rest}>{children}</DrawerBody>
      </>
    )
  }

  return (
    <Box {...rest}>
      <Flex
        w="100%"
        pt={{ base: 0, lg: 6 }}
        pr={{ base: 5, lg: '64px' }}
        pb={5}
        pl={{ base: 5, lg: 0 }}
        justifyContent="space-between"
      >
        {typeof title === 'string' ? (
          <PageTitle label={title} renderingInModal={renderingInModal} />
        ) : (
          title || null
        )}
        {topToolbar}
      </Flex>

      {children}

      {bottomToolbar}
    </Box>
  )
}
