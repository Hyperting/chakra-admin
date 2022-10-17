import { ReactElement, ReactNode, Children, cloneElement, isValidElement } from 'react'
import { ReadonlyDeep } from 'type-fest'
import { CUILayoutComponents, getRegisteredLayoutComponents, registerLayoutComponent } from '../react/system-layout'

export const hasChildren = (element: ReactNode): element is ReactElement<{ children: ReactNode | ReactNode[] }> =>
  isValidElement<{ children?: ReactNode[] }>(element) && Boolean(element.props.children)

export const hasComplexChildren = (
  element: ReactNode
): element is ReactElement<{ children: ReactNode | ReactNode[] }> =>
  isValidElement(element) &&
  hasChildren(element) &&
  Children.toArray(element.props.children).reduce(
    (response: boolean, child: ReactNode): boolean => response || isValidElement(child),
    false
  )

export const isChildrenComplex = (children: ReactNode): boolean =>
  Children.toArray(children).reduce(
    (response: boolean, child: ReactNode): boolean => response || isValidElement(child),
    false
  )

export const deepMap = (
  children: ReactNode | ReactNode[],
  deepMapFn: (child: ReactNode, index?: number, children?: readonly ReactNode[]) => ReactNode
): ReactNode[] =>
  Children.toArray(children).map((child: ReactNode, index: number, mapChildren: readonly ReactNode[]) => {
    if (
      isValidElement(child) &&
      hasComplexChildren(child) &&
      child?.type // &&
      // (Object.values(CUILayoutComponents).includes(child.type as any) ||
      //   getRegisteredLayoutComponents().includes(child.type as any))
    ) {
      // Clone the child that has children and map them too
      return deepMapFn(
        cloneElement(child, {
          ...child.props,
          children: deepMap(child.props.children, deepMapFn),
        })
      )
    }
    return deepMapFn(child, index, mapChildren)
  })

export const deepForEach = (
  children: ReadonlyDeep<ReactNode | ReactNode[]>,
  deepForEachFn: (child: ReadonlyDeep<ReactNode>, index?: number) => void
): void => {
  Children.forEach(children, (child: ReadonlyDeep<ReactNode>, index: number) => {
    if (
      isValidElement(child) &&
      hasComplexChildren(child) &&
      child?.type // &&
      // (Object.values(CUILayoutComponents).includes(child.type as any) ||
      //   getRegisteredLayoutComponents().includes(child.type as any))
    ) {
      // Each inside the child that has children
      deepForEach((child as any)?.props?.children, deepForEachFn)
    }

    deepForEachFn(child, index)
  })
}
