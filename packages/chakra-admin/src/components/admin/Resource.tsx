import React, { FC } from 'react'

export type ResourceProps = {
  name: string
  icon?: React.ReactNode
  list?: React.ReactNode
  create?: React.ReactNode
  edit?: React.ReactNode
  show?: React.ReactNode
}

export const Resource: FC<ResourceProps> = () => {
  return null
}
