import { ApolloClient, useApolloClient } from '@apollo/client'
import { FC, useEffect } from 'react'
import { NavigateOptions, To, useLocation, useNavigate } from 'react-router-dom'

export type MiddlewareRedirect =
  | {
      to: To
      options?: NavigateOptions
    }
  | string

export type MiddlewareFn = (
  client: ApolloClient<any>
) => (true | MiddlewareRedirect) | Promise<true | MiddlewareRedirect>
export type Middleware = MiddlewareFn | MiddlewareFn[]

type RouteMiddlewareProps = {
  middleware?: Middleware
  children?: JSX.Element
}

export const RouteMiddleware: FC<RouteMiddlewareProps> = ({ children, middleware: middlewareProp }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const client = useApolloClient()

  useEffect(() => {
    const run = async () => {
      if (middlewareProp) {
        const middleware = Array.isArray(middlewareProp) ? middlewareProp : [middlewareProp]
        for (const fn of middleware) {
          const result = await fn(client)
          if (result !== true) {
            const { to, options } = typeof result === 'string' ? { to: result, options: {} } : result
            navigate(to, options)
            return
          }
        }
      }
    }

    run()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location])

  return <>{children}</>
}
