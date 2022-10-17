import { motion } from 'framer-motion'
import { Box, BoxProps, Flex, FlexProps, HStack, StackProps } from '@chakra-ui/react'

export const MotionBox = motion<BoxProps>(Box)

export const MotionFlex = motion<FlexProps>(Flex)
export const MotionHStack = motion<StackProps>(HStack)
