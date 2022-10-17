import { NavigateFunction } from 'react-router-dom'

export type NavigateBehavior = boolean | string | ((data: any) => string | boolean)

export const navigateBehavior = (
  navigate: NavigateFunction,
  redirect: NavigateBehavior,
  data?: unknown
) => {
  let goTo: boolean | string

  switch (typeof redirect) {
    case 'function':
      goTo = redirect(data)
      break
    case 'undefined':
      goTo = true
      break
    default:
      goTo = redirect
  }

  if (goTo) {
    if (typeof goTo === 'string') {
      return navigate(goTo)
    } else {
      return navigate(-1)
    }
  }
}
