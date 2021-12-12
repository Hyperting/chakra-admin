import React, { FC } from 'react'
import { Text, Image, Box, Container, chakra } from '@chakra-ui/react'
import { LoginForm } from './LoginForm'

type Props = {
  applicationImageUrl?: string
  applicationIcon?: string
}
export const Login: FC<Props> = ({ applicationIcon, applicationImageUrl }) => {
  return (
    <chakra.div d="flex" flexDir={{ base: 'column', md: 'row' }}>
      <chakra.div
        display="flex"
        flexDir="column"
        justifyContent="center"
        alignItems="center"
        w={{ base: '100%', md: '50%' }}
        minH={{ md: '100vh' }}
      >
        <Box
          w={{ base: '100vw', md: '50vw' }}
          h={{ base: '50vh', md: '100vh' }}
          opacity="0.05"
          bgGradient="linear(180deg, orange.500 0%, red.500 100%)"
          pos="absolute"
          top="0"
        />
        <chakra.div
          my={{ base: 10, md: 0 }}
          mb={6}
          d="flex"
          flexDir="column"
          alignItems="center"
          justifyContent="center"
          alignSelf="center"
        >
          <Image
            w={{ base: '37px', md: '73px' }}
            h={{ base: '37px', md: '73px' }}
            objectFit="contain"
            // src={logo}
          />
          <Text textStyle="h1" mt={{ base: 2.5, md: 5 }} mb={{ base: 1, md: 2.5 }}>
            A regola d’arte
          </Text>
          <Text textStyle="subtitle" maxW="397px" textAlign="center">
            Benvenuto nel CRM per la gestione eventi per artist
          </Text>
          <Image
            mt={12}
            w={{ base: '211px', md: '423px' }}
            h={{ base: '139px', md: '279px' }}
            objectFit="contain"
            // src={undraw_compose}
          />
        </chakra.div>
      </chakra.div>
      <Container
        display="flex"
        flexDir="column"
        alignItems="center"
        justifyContent="center"
        maxW="container.xl"
        w={{ base: '100%', md: '50%' }}
        my={{ base: 10, md: 0 }}
      >
        <chakra.div d="flex" flexDir="column" w={{ base: '100%', md: 'auto' }}>
          <LoginForm />
        </chakra.div>
      </Container>
    </chakra.div>
  )
}
