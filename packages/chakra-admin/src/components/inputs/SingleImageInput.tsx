import React, { FC } from 'react'
import { CAInputProps } from '../../core/react/system-form'

type Props<TItem = Record<string, any>> = {
  //
} & CAInputProps<TItem>

export function SingleImageInput<TItem = Record<string, any>>({
  source,
}: //
Props<TItem>) {
  return <div>{source}</div>
}
