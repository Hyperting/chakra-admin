import React, { FC, useEffect, useRef, useState } from 'react'
import { I18nextProvider, I18nextProviderProps } from 'react-i18next'
import { InitOptions, Callback } from 'i18next'

export type I18nProviderProps = {
  fallback?: React.ReactNode
  options?: InitOptions
  callback?: Callback
} & Omit<Partial<I18nextProviderProps>, 'i18n'> &
  Pick<I18nextProviderProps, 'i18n'>

export const I18nProvider: FC<I18nProviderProps> = ({
  i18n,
  fallback = <div>Loading</div>,
  options,
  callback,
  ...props
}) => {
  const [initialized, setInitialized] = useState<boolean>(false)
  const isAlreadyInitialized = useRef(false)

  useEffect(() => {
    const onInitialized = () => {
      setInitialized(true)
    }

    if (i18n.isInitialized) {
      setInitialized(true)
      isAlreadyInitialized.current = true
    } else {
      i18n.on('initialized', onInitialized)
      if (options || callback) {
        if (options) {
          i18n.init(options, callback)
        } else {
          i18n.init(callback)
        }
      }
    }

    return () => {
      if (!isAlreadyInitialized.current) {
        i18n.off('initialized', onInitialized)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n])

  if (!initialized) {
    return <>{fallback}</>
  }

  return <I18nextProvider i18n={i18n} {...props} />
}
