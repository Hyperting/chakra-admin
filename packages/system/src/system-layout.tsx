import { Children, cloneElement, createElement, FC, useEffect } from 'react'
import {
  Alert as CUIAlert,
  As,
  Box,
  Center,
  Container,
  Flex,
  Grid,
  SimpleGrid,
  Stack,
  Wrap,
  HStack,
  VStack,
  AspectRatio,
  WrapItem,
  Square,
  Circle,
  GridItem,
  Portal,
  List,
  OrderedList,
  UnorderedList,
  TabPanel,
  TabPanels,
  Tabs,
  AlertProps,
  AspectRatioProps,
  BoxProps,
  CenterProps,
  ContainerProps,
  FlexProps,
  GridItemProps,
  GridProps,
  ListProps,
  PortalProps,
  SimpleGridProps,
  SquareProps,
  StackProps,
  TabPanelProps,
  TabPanelsProps,
  TabsProps,
  WrapItemProps,
  WrapProps,
  StatGroup,
  StatGroupProps,
  Stat,
  StatProps,
  TabListProps,
  TabList,
  ComponentWithAs,
} from '@chakra-ui/react'
import { filterChakraProps } from './system-utils'
import { isChildrenComplex } from './deep-map'

// fix components without displayName
const Alert = CUIAlert
Alert.displayName = 'Alert'

export const CALayoutComponents = {
  Alert: caLayout<AlertProps>(Alert),
  AspectRatio: caLayout<AspectRatioProps>(AspectRatio),
  Box: caLayout<BoxProps>(Box),
  Center: caLayout<CenterProps>(Center),
  Square: caLayout<SquareProps>(Square),
  Circle: caLayout<SquareProps>(Circle),
  Container: caLayout<ContainerProps>(Container),
  Flex: caLayout<FlexProps>(Flex),
  Grid: caLayout<GridProps>(Grid),
  GridItem: caLayout<GridItemProps>(GridItem),
  SimpleGrid: caLayout<SimpleGridProps>(SimpleGrid),
  Stat: caLayout<StatProps>(Stat),
  StatGroup: caLayout<StatGroupProps>(StatGroup),
  Stack: caLayout<StackProps>(Stack),
  HStack: caLayout<StackProps>(HStack),
  VStack: caLayout<StackProps>(VStack),
  Wrap: caLayout<WrapProps>(Wrap),
  WrapItem: caLayout<WrapItemProps>(WrapItem),
  Portal: caLayout<PortalProps>(Portal),
  List: caLayout<ListProps>(List),
  OrderedList: caLayout<ListProps>(OrderedList),
  Tabs: caLayout<TabsProps>(Tabs),
  TabList: caLayout<TabListProps>(TabList),
  TabPanels: caLayout<TabPanelsProps>(TabPanels),
  TabPanel: caLayout<TabPanelProps>(TabPanel),
  UnorderedList: caLayout<ListProps>(UnorderedList),
}

export const CUILayoutComponents: Record<string, ComponentWithAs<any, any>> = {
  Alert,
  AspectRatio,
  Box,
  Center,
  Square,
  Circle,
  Container,
  Flex,
  Grid,
  GridItem,
  SimpleGrid,
  Stat,
  StatGroup,
  Stack,
  HStack,
  VStack,
  Wrap,
  WrapItem,
  Portal,
  List,
  OrderedList,
  Tabs,
  TabList,
  TabPanels,
  TabPanel,
  UnorderedList,
  // 'ca.StatHelpText': CAFieldComponents.StatHelpText,
  // 'ca.StatLabel': CAFieldComponents.StatLabel,
  // 'ca.StatNumber': CAFieldComponents.StatNumber,
  // DataTable,
}

export const registeredLayoutComponents: React.ReactElement[] = []

export const getRegisteredLayoutComponents = () => {
  return registeredLayoutComponents
}

export const registerLayoutComponent = (component: React.ReactElement) => {
  if (registeredLayoutComponents?.indexOf(component) === -1) {
    registeredLayoutComponents?.push(component)
  }
}

export function removeLayoutComponent(component: React.ReactElement) {
  if (registeredLayoutComponents?.indexOf(component) !== -1) {
    registeredLayoutComponents?.splice(registeredLayoutComponents.indexOf(component), 1)
  }
}

export const useRegisterLayoutComponent = (component: React.ReactElement) => {
  useEffect(() => {
    registerLayoutComponent(component)
    return () => {
      removeLayoutComponent(component)
    }
  }, [component])
}

export function caLayout<P = {}, T = As>(component: T): FC<P & { [x: string]: any }> {
  const CALayoutImpl = ({ children, record, ...props }: any) => {
    useRegisterLayoutComponent(CALayoutImpl as any)
    return createElement(
      component as any,
      props,
      isChildrenComplex(children)
        ? Children.toArray(children).map((child) => {
            return cloneElement(child as any, {
              ...filterChakraProps(props || {}),
              ...((child as any).props || {}),
              record,
            })
          })
        : children
    )
  }

  ;(CALayoutImpl as unknown as FC<P & { [x: string]: any }>).displayName = `CA${
    (component as any).displayName || (component as any).name
  }`

  return CALayoutImpl as unknown as FC<P & { [x: string]: any }>
}
