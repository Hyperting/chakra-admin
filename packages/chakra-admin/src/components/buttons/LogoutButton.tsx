import { Button, useToast, ButtonProps } from '@chakra-ui/react'
import React, { FC, useCallback, useState } from 'react'
import { useAuthProvider } from '../../core/auth/useAuthProvider'

type Props = ButtonProps & {
  label?: string
  icon?: any
}
export const LogoutButton: FC<Props> = ({ label = 'Esci', icon, ...rest }) => {
  const authProvider = useAuthProvider()
  const toast = useToast()
  const [loading, setLoading] = useState<boolean>(false)

  const onLogout = useCallback(async () => {
    try {
      setLoading(true)
      await authProvider?.logout()
      window.location.reload()
    } catch (error) {
      toast({
        title: 'Errore',
        description: 'Errore durante il logout',
        status: 'error',
        isClosable: true,
      })
    } finally {
      setLoading(false)
    }
  }, [authProvider, toast])

  return (
    <Button colorScheme="red" onClick={onLogout} isLoading={loading} disabled={loading} {...rest}>
      {label} {icon}
    </Button>
  )
}
