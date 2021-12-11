import React, { Children, cloneElement, createElement, FC, isValidElement } from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
} from '@chakra-ui/modal'
import { Button } from '@chakra-ui/button'
import { AuthProvider } from '../../core/auth/AuthProvider'
import { ClassType } from '../../core/ClassType'
import { Layout } from '../layout/Layout'
import { Resource } from './Resource'
import { Login } from '../login/Login'
import { useAdminCore } from '../../core/admin/useAdminCore'
import { Loading } from './Loading'
import { RouteAvailability } from '../../core/admin/RouteAvailability.js'

export type AdminCoreProps = {
  layoutComponent?: React.ReactNode
  loginComponent?: React.ReactNode
  authProvider?: ClassType<AuthProvider>
  children?: React.ReactNode
  customRoutes?: React.ReactNode[]
}

export const AdminCore: FC<AdminCoreProps> = (props) => {
  const { loginComponent = <Login />, customRoutes } = props

  if (Children.count(props.children) === 0) {
    throw new Error('Admin has no children')
  }

  const { initialized, location, background } = useAdminCore(props)

  if (!initialized) {
    return <Loading />
  }

  return (
    <Switch>
      {isValidElement(loginComponent) && (
        <Route path="/login">{cloneElement(loginComponent, {})}</Route>
      )}

      {customRoutes}

      <Route>
        <Layout>
          <Switch location={background || location}>
            {Children.map(props.children, (child: React.ReactNode, index) => {
              if (isValidElement(child) && child.type === Resource && child.props.name) {
                const newChildren: React.ReactNode[] = []
                const crud: RouteAvailability = {
                  hasCreate: child.props.create,
                  hasEdit: child.props.edit,
                  hasShow: child.props.show,
                }

                if (child.props.create) {
                  newChildren.push(
                    <Route
                      key={`resource-${child.props.name}-create`}
                      path={`/${
                        child.props.overrideName ? child.props.overrideName : child.props.name
                      }/create`}
                      render={() => {
                        return createElement(child.props.create, {
                          resource: child.props.name,
                          basePath: '/',
                          ...crud,
                        })
                      }}
                    />
                  )
                }

                if (child.props.edit) {
                  newChildren.push(
                    <Route
                      key={`resource-${child.props.name}-edit`}
                      path={`/${
                        child.props.overrideName ? child.props.overrideName : child.props.name
                      }/:id`}
                      render={({ match: { params } }) => {
                        return createElement(child.props.edit, {
                          resource: child.props.name,
                          basePath: '/',
                          id: params.id,
                          ...crud,
                        })
                      }}
                    />
                  )
                }

                if (child.props.list) {
                  newChildren.push(
                    <Route
                      key={`resource-${child.props.name}-list`}
                      path={`/${
                        child.props.overrideName ? child.props.overrideName : child.props.name
                      }`}
                      render={() => {
                        return createElement(child.props.list, {
                          resource: child.props.name,
                          basePath: '/',
                          ...crud,
                        })
                      }}
                    />
                  )
                }

                return newChildren
              }

              return null
            })}
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            <Redirect to={`/${(Children.toArray(props.children)[0] as any).props.name}`} />
          </Switch>

          {background && (
            <Switch>
              {Children.map(props.children, (child: React.ReactNode, index) => {
                if (isValidElement(child) && child.type === Resource && child.props.name) {
                  const newChildren: React.ReactNode[] = []
                  const crud: RouteAvailability = {
                    hasCreate: child.props.create,
                    hasEdit: child.props.edit,
                    hasShow: child.props.show,
                  }

                  // if (child.props.create) {
                  //   newChildren.push(
                  //     <Route
                  //       key={`resource-${child.props.name}-create`}
                  //       path={`/${
                  //         child.props.overrideName ? child.props.overrideName : child.props.name
                  //       }/create`}
                  //       render={() => {
                  //         return createElement(child.props.create, {
                  //           resource: child.props.name,
                  //           basePath: '/',
                  //           ...crud,
                  //         })
                  //       }}
                  //     />
                  //   )
                  // }

                  if (child.props.edit) {
                    newChildren.push(
                      <Route
                        key={`resource-${child.props.name}-edit`}
                        path={`/${
                          child.props.overrideName ? child.props.overrideName : child.props.name
                        }/:id`}
                        render={({ match: { params } }) => {
                          return (
                            <Drawer isOpen placement="right" onClose={() => {}}>
                              <DrawerOverlay />
                              <DrawerContent>
                                <DrawerCloseButton />
                                <DrawerHeader>Create your account</DrawerHeader>

                                <DrawerBody>
                                  {createElement(child.props.edit, {
                                    resource: child.props.name,
                                    basePath: '/',
                                    id: params.id,
                                    ...crud,
                                  })}
                                </DrawerBody>

                                <DrawerFooter>
                                  <Button variant="outline" mr={3}>
                                    Cancel
                                  </Button>
                                  <Button colorScheme="blue">Save</Button>
                                </DrawerFooter>
                              </DrawerContent>
                            </Drawer>
                          )
                        }}
                      />
                    )
                  }

                  return newChildren
                }

                return null
              })}
            </Switch>
          )}
        </Layout>
      </Route>
    </Switch>
  )
}
