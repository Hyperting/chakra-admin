import { Children, cloneElement, createElement, FC } from 'react'
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
} from '@chakra-ui/react'
import { filterChakraProps } from './system-utils'
import { areComplexChildren } from '../details/deep-map'

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
  // FormControl: caLayout<FormControlProps>(FormControl),
  Portal: caLayout<PortalProps>(Portal),
  List: caLayout<ListProps>(List),
  OrderedList: caLayout<ListProps>(OrderedList),
  Tabs: caLayout<TabsProps>(Tabs),
  TabPanels: caLayout<TabPanelsProps>(TabPanels),
  TabPanel: caLayout<TabPanelProps>(TabPanel),
  UnorderedList: caLayout<ListProps>(UnorderedList),
}

export function caLayout<P = {}, T = As<any>>(component: T): FC<P & { [x: string]: any }> {
  const CALayoutImpl = ({ children, record, ...props }) => {
    return createElement(
      component as any,
      props,
      areComplexChildren(children)
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

  ;((CALayoutImpl as unknown) as FC<P & { [x: string]: any }>).displayName = `CA${
    (component as any).displayName || (component as any).name
  }`

  return (CALayoutImpl as unknown) as FC<P & { [x: string]: any }>
}
