import { useToast } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { DefaultUserIdentity } from './AuthProvider'
import { useAuthProvider } from './useAuthProvider'

export type UseAuthUserReturn = {
  initialized: boolean
  user?: DefaultUserIdentity
}

export const useAuthUser = () => {
  const authProvider = useAuthProvider()
  const [initialized, setInitialized] = useState<boolean>(false)
  const [user, setUser] = useState<DefaultUserIdentity | undefined>()
  const notify = useToast()

  useEffect(() => {
    const init = async (): Promise<void> => {
      try {
        setInitialized(false)
        const result = await authProvider?.getIdentity()
        if (result) {
          setUser(result)
        }
      } catch (error) {
        // if (error) {
        //   console.error('error fetching authenticated user', error)
        //   notify({
        //     status: 'error',
        //     title: "Can't fetch authenticated user",
        //     description: error.message,
        //   })
        // }
      } finally {
        setInitialized(true)
      }
    }

    init()
    // alert(`useAuthUser: ${JSON.stringify(initialized)}`)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return {
    initialized,
    user,
  }
}
