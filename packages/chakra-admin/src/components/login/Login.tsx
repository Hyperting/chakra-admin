import { FC } from 'react'
import { Container, chakra } from '@chakra-ui/react'
import { LoginForm } from './LoginForm'

type Props = {
  applicationImageUrl?: string
  applicationIcon?: string
}
export const Login: FC<Props> = ({ applicationIcon, applicationImageUrl }) => {
  return (
    <Container
      display="flex"
      flexDir="column"
      alignItems="center"
      justifyContent="center"
      maxW="container.xl"
      w={{ base: '100%', md: '50%' }}
      my={{ base: 10, md: 0 }}
    >
      <chakra.div display="flex" flexDir="column" w={{ base: '100%', md: 'auto' }}>
        <LoginForm />
      </chakra.div>
    </Container>
  )
}
