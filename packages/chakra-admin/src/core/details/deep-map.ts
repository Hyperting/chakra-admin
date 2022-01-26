import { ReactElement, ReactNode, Children, cloneElement, isValidElement } from 'react'
import { CALayoutComponents, CUILayoutComponents } from '../react/system-layout'

export const hasChildren = (
  element: ReactNode
): element is ReactElement<{ children: ReactNode | ReactNode[] }> =>
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

export const areComplexChildren = (children: ReactNode): boolean =>
  Children.toArray(children).reduce(
    (response: boolean, child: ReactNode): boolean => response || isValidElement(child),
    false
  )

export const deepMap = (
  children: ReactNode | ReactNode[],
  deepMapFn: (child: ReactNode, index?: number, children?: readonly ReactNode[]) => ReactNode
): ReactNode[] =>
  Children.toArray(children).map(
    (child: ReactNode, index: number, mapChildren: readonly ReactNode[]) => {
      console.log(
        Object.values(CUILayoutComponents).includes((child as any)?.type as any),
        '<-- check'
      )
      if (
        isValidElement(child) &&
        hasComplexChildren(child) &&
        Object.values(CUILayoutComponents).includes(child.type as any)
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
    }
  )
