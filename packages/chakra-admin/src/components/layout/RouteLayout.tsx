import { Box, useBreakpointValue } from '@chakra-ui/react'
import React, { FC } from 'react'
import { Outlet } from 'react-router-dom'
import { MobileTopBarLight } from './MobileTopBarLight'
import { OfflineAlert } from './OfflineAlert'
import { Sidebar } from './sidebar/Sidebar'

export type RouteLayoutProps = {
  sidebar?: React.ReactNode
  showOfflineAlert?: boolean
}
export const RouteLayout: FC<RouteLayoutProps> = ({
  sidebar = <Sidebar />,
  showOfflineAlert = true,
  children,
}) => {
  const isMobile = useBreakpointValue({
    base: true,
    lg: false,
  })

  return (
    <Box d="flex" h="100vh" w="100vw" maxW="100%" overflow="hidden">
      {showOfflineAlert && <OfflineAlert />}
      {isMobile ? (
        <MobileTopBarLight
          title="A Regola d'Arte"
          icon="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC0AAAAbCAYAAADoOQYqAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAeDSURBVHgBzVdrbFRFFD4z91663VLAWrbdJ7WtogRFU1Tig9RqfOIrKGoQowZjYqIkajQ+UDFB+aHxEQ1oxEQxihoT1PiIiG3QoEQBrVpN2drH3u1CH2Lpsuy2e2f85u69+1CrxobYk9w755w5c+ebc86cmcuoiNqqG1YLLpcSyU9aBrrvof+ZWn0NT0iS5zHJ3j9nsGu1q+cu81WwMWRx+QjYBVLQ5zQViMk2UniYvKu1tq7OVedBH87KhxlkKWkkm+Y7aQpQxhjbAeRDYMuFxVe5eht066y6WULIaxzdRxckuwZoCtCFpvkrkdiheMbo5i+qqysVb4OWOr8YSltBXLxHkycWDAaPVi1NkpgkF8+MDE1frphcemi03DXKjOsT5nMoFCpvbm7WS3X+K8Nh//pQyHdSfb0/EgoF38azj3MaCoeDvQ0NgfAfvxOJhG6PRIJLinU+n68B9o9hjpNKjHXjXbyzuRXwZXazvXqOP8t5FKyXpPy5ZbD7BNdeAezs7GzWNLoC4iWwqUN7ALG5OxbrfwWTvAT5RuyDTvStYIwNI5xRKeUe8Js0je3o6TF3AuQ66KzKyplrOjo6xjDuW4yrLisrb4hGoxk1F3RqH52Gp0vTjPk9PT1pF8c23zFdjFg92FEmxXF6VtPmkSSvvQLGfnQNa2tr66LRvW9g4kUQkVv0Hvp/klIckpIn5swJ3YR9oAC3S3mwJR4fHYaXmpFmWLt81TT7ny64S2LBND+ZHGn0+/03qdjCRgCw7cFgsHaZA/hTPOdZ1phy0mZ3NEreTiSaAl1pkXayjjq4iDmpJyR94xoahtaMZhE+/jGy6A7TNPe6fVVVVTMqKsp3A+D+TGb8/IGB0WGn66hcw9MAF5k7d25/W1tbFgsrgzKFdhmcUA3e4pyPqta25tpdaNJCiC+hPxfOWVkMGk79GhCvU6xG4kzOBZ2eX5Emf3H5WCy+Cc0DAOZlTHyCHPwNIXxS9ZWXly9E0wAQj3g8HhXurei/GnZlORC0HuB6urr2vuN8zoOZO+Dc+wCoBfICABzLpYX/AsfLHgBerdII321xNrJNlqTePH7G5nFJLOAqPJaW96ayRQ4+gVRoBb9H5lJIhRHzsqRjcxHmiGOiBVKO74ZtxtFvYEw7Fgu/3J5IShVKZpqJdRi7SgFDa4OG3UrIiIZYrut0MvR3kF11xMV5JIIKuBjN4zCa48qjlhwqAk0jIyOV8F41bBBGfmsymZqvMCBVVBo9iAdj2euoOafEYgNdhmHsVlNggbgKiHZ4//0cMPYCdH2K7+szn9V1dpYQtLSxsbEMYC9CNF/Dgl7v7o5/h0VsVhHBZtzt4kjzsV/znpayjm3z1Qvm1FM9xX2Lk9FBmgSFQoGHAHIeWGxqvjGGMjORLTb7bF3X1gPWKtMcjk9ktyMUqkqPTXP3Dems6ABI8bRFkyRUjUf/St/U1GT09/efaBh8MaYMwJteeK3VNONX/cMn6dChaZZmFGRUD1Ketg8Zr9ej0UH6z4R6vAZhfwfp016sRyU5fv/+xI+6ztXdBiThNfYDIvKDaxMIBC5Db53HU/GCW7td8ogsHyfnTMN+4ACcTwcrna0oNsaHwuFw4OaamhqfksHfDWC3uP3hcGgjKsf9rgzP3cqYfLEIrFd5OJFI/IwcPRWqO5UeYJ/HJm3Gs0HJqO8notpsYYw/k8kc/tOVmBmyvCCwAQW6Mz+pRjXFxihdt8Fqo2GwhQoAisDjALayYCEvw2utAxybGueAxF53CJ7dMjCQ+Ezxvb29qC5sj+JR7lIloJhYg6ZflUW0N6q5ivszxGuLrLtVWnTlZY3NpdI1BtUYKbV27PhLAUrF6PPCZLY8roBHIoHHAErA0/uKPuCH1cKCaHnspUqZD38kEmmCzZVgd+Ex8dSjXl9SikMr4GIixrHzvnZleClSApnZXktynp0FaR34FML8XMFeGhizFeybAHwvNPAIGykan7UdVZjcDjPnuRqd+0b2TodF1Nj5uX5VMgvEmazP2xPfhhMxu7PQyc6gEuLb8QJg++aHOzctwUWmp9RGchxCN4BZ6yxcKwDibQDyU2ERwvW0DVqVPGiXYswHWODVmK8R6u/xXEhFPyioFPloMTneoafFtL0eLvZDrsHH5hfDQY19GeGLwRtVALArHjejpYDZBnilWt3cIDyIFGkTIpe3ijRNwyExNjs/uWCoHzZr3+CQ82pPlMFz6/r6El8onbpQaRpfocwLi2XHk111aGiaSLXbNbrVV78JuutV+TNSqdrFyX2TOmAmItwnFqGsbQX4K+Lx+DZUInWkT0cVWTvRmO3TG2dnvbZTGUL0Jq7O19rrFpLbfweqXmcryi6lI0QA+lVl5ayjFWAl40h/5u8AK8p4xdnkHoCMvaUaG/TMwZlb4P4Dtl5qS+gIkpNK/5o4yRUOO8i84sOcDrSQdo1jFU85nWepH12aAvRhVeMMlH71E4Irqdx8jvM3k9+h0tJeRpNEXs/OeviZNAXIq1vqrq8OFsuwxOOuPg/63OHOOP581yLZ25gQp9EUIEuyJhuPpAcWD/UmXP3vADEV5vCasqMAAAAASUVORK5CYII="
        >
          {sidebar}
        </MobileTopBarLight>
      ) : (
        sidebar
      )}
      <Box
        pl={isMobile ? 0 : '25px'}
        // pt={isMobile ? '25px' : 0}
        mt={isMobile ? 16 : 0}
        flex="1"
        bgColor="gray.50"
        overflowY="auto"
      >
        <Outlet />
      </Box>
    </Box>
  )
}
