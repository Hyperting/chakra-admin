import { FC } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useCheckAuth } from '../../core'

type RequireAuthProps = {
  children?: JSX.Element
  skip?: boolean
}

export const RequireAuth: FC<RequireAuthProps> = ({ skip, children }) => {
  const { initialized, isAuthenticated } = useCheckAuth({
    onAuthCheck: (isAuthenticated) => {
      console.log('RequireAuth', { initialized, isAuthenticated, location, skip })
    },
  })
  const location = useLocation()

  if (skip) {
    return <>{children}</>
  }

  if (!initialized) {
    return null
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <>{children}</>
}
