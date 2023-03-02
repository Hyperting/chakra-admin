import { RouteProps as ReactRouterProps } from 'react-router-dom'

export type RouteProps = {
  useAdminLayout?: boolean
} & ReactRouterProps

export function Route(props: RouteProps) {
  return null
}
