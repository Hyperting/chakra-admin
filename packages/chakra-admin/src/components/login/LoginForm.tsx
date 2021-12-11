import React, { FC, useState } from 'react'
import { chakra } from '@chakra-ui/system'
import {
  Alert,
  AlertIcon,
  Button,
  Flex,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  Text,
} from '@chakra-ui/react'
import { useForm } from 'react-hook-form'
import { useHistory } from 'react-router-dom'
import { BiHide, BiShow } from 'react-icons/bi'
import { useAuthProvider } from '../../core/auth/useAuthProvider'

type LoginData = {
  email: string
  password: string
  rememberMe?: boolean
}

type Props = {
  title?: string
  caption?: string
}
export const LoginForm: FC<Props> = ({
  title = 'Entra nel gestionale',
  caption = 'Inserisci email e password',
}) => {
  const authProvider = useAuthProvider()
  if (!authProvider) {
    throw new Error('AuthProvider is not available in LoginForm')
  }

  const history = useHistory()
  const [submitting, setSubmitting] = useState<boolean>(false)
  const [error, setError] = useState<boolean>(false)
  const [show, setShow] = useState<boolean>(false)
  const handleClick = (e: boolean) => () => setShow(e)
  const { register, handleSubmit, control } = useForm<LoginData>()

  const onSubmit = handleSubmit(async (credentials) => {
    try {
      setSubmitting(true)
      setError(false)
      await authProvider.login(credentials)
      history.replace('/')
    } catch (e) {
      console.error(e)
      setError(true)
    } finally {
      setSubmitting(false)
    }
  })

  return (
    <chakra.form
      w={{ base: '100%', lg: undefined }}
      onSubmit={onSubmit}
      display="flex"
      flexDir={{ base: 'column' }}
    >
      <chakra.div minW={{ base: undefined, lg: '474px' }} w={{ base: '100%', lg: '474px' }}>
        {title && <Text textStyle="h1">{title}</Text>}
        {caption && (
          <Text textStyle="description" mt={1.5} mb={6}>
            {caption}
          </Text>
        )}
        <Stack spacing={5}>
          <>
            <Text textStyle="inputDesc">email</Text>
            <Input
              {...register('email', { required: true })}
              placeholder="Enter email"
              type="email"
              autoCapitalize="off"
              size="lg"
              fontSize="14px"
              fontWeight="400"
              lineHeight="20px"
              letterSpacing="0.3px"
              _placeholder={{ color: 'gray.500' }}
              borderRadius="4px"
            />
          </>
          <>
            <Flex w="100%" justifyContent="space-between" alignItems="center">
              <Text textStyle="inputDesc">password</Text>

              <Text
                fontWeight="400"
                fontSize="10px"
                lineHeight="12.6px"
                letterSpacing="0.1px"
                color="gray.500"
                as="button"
                _hover={{ color: 'gray.600' }}
              >
                Forgot password?
              </Text>
            </Flex>
            <InputGroup>
              <Input
                {...register('password', { required: true })}
                type={show ? 'text' : 'password'}
                placeholder="Password"
                size="lg"
                fontSize="14px"
                fontWeight="400"
                lineHeight="20px"
                letterSpacing="0.3px"
                _placeholder={{ color: 'gray.500' }}
                borderRadius="4px"
              />
              <InputRightElement width="4.5rem" h="100%">
                {show ? (
                  <IconButton
                    variant="ghost"
                    _hover={{ bgColor: 'none' }}
                    _active={{ bgColor: 'none' }}
                    aria-label="Search database"
                    fontSize="17px"
                    color="#9FA2B4"
                    icon={<BiHide />}
                    onClick={handleClick(false)}
                  />
                ) : (
                  <IconButton
                    variant="ghost"
                    _hover={{ bgColor: 'none' }}
                    _active={{ bgColor: 'none' }}
                    fontSize="17px"
                    aria-label="Search database"
                    color="#9FA2B4"
                    icon={<BiShow />}
                    onClick={handleClick(true)}
                  />
                )}
              </InputRightElement>
            </InputGroup>
          </>
        </Stack>
        {error && (
          <Alert mt={4} status="error" variant="solid">
            <AlertIcon />
            Username o password errati
          </Alert>
        )}
      </chakra.div>

      <Button
        type="submit"
        bgColor="red.700"
        _hover={{
          bgColor: 'red.500',
        }}
        _active={{
          bgColor: 'red.500',
        }}
        alignSelf={{ base: undefined, lg: 'flex-end' }}
        my={{ base: 5, lg: undefined }}
        color="white"
        size="lg"
        fontSize="14px"
        fontWeight="600"
        lineHeight="20px"
        letterSpacing="0.2px"
        w="100%"
        h="46px"
        borderRadius="8px"
        textTransform="capitalize"
        disabled={submitting}
        isLoading={submitting}
        boxShadow="main"
      >
        log in
      </Button>
      <Flex alignItems="center">
        <Text textStyle="description">Don’t have an account?</Text>
        <Text
          textStyle="description"
          fontWeight="600"
          color="red.700"
          as="button"
          ml="2"
          _hover={{ color: 'red.500' }}
        >
          Sign up
        </Text>
      </Flex>
    </chakra.form>
  )
}
