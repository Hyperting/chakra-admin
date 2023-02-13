import React, { FC } from 'react'
import { Middleware } from './RouteMiddleware'

export type ResourceProps = {
  name: string
  overrideName?: string
  routeMiddleware?: Middleware
  icon?: React.ReactNode
  list?: React.ReactNode
  create?: React.ReactNode
  edit?: React.ReactNode
  show?: React.ReactNode
}

export const Resource: FC<ResourceProps> = () => {
  return null
}
