import React, { Children, cloneElement, createElement, FC, isValidElement } from 'react'
import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Button,
} from '@chakra-ui/react'
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

const ModalLayout: FC = () => {
  return (
    <Drawer isOpen placement="right" onClose={() => {}}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>Create your account</DrawerHeader>

        <DrawerBody>
          <Outlet />
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
}

export const AdminCore: FC<AdminCoreProps> = (props) => {
  const { loginComponent = <Login />, layoutComponent = <Layout />, customRoutes } = props

  if (Children.count(props.children) === 0) {
    throw new Error('Admin has no children')
  }

  const { initialized, location, background } = useAdminCore(props)

  if (!initialized) {
    return <Loading />
  }

  return (
    <>
      <Routes location={background || location}>
        {isValidElement(loginComponent) && (
          <Route path="/login" element={cloneElement(loginComponent, {})} />
        )}

        {customRoutes}

        <Route path="/" element={layoutComponent}>
          {Children.map(props.children, (child: React.ReactNode, index) => {
            if (isValidElement(child) && child.type === Resource && child.props.name) {
              const crud: RouteAvailability = {
                hasCreate: !!child.props.create,
                hasEdit: !!child.props.edit,
                hasShow: !!child.props.show,
                hasList: !!child.props.list,
              }

              const resourceProps = {
                resource: child.props.name,
                ...crud,
              }

              if (crud.hasList) {
                return (
                  <Route path={child.props.overrideName || child.props.name}>
                    {crud.hasList && (
                      <Route
                        index
                        element={createElement(child.props.list, { ...resourceProps })}
                      />
                    )}
                    {crud.hasCreate && (
                      <Route
                        path="create"
                        element={createElement(child.props.create, { ...resourceProps })}
                      />
                    )}
                    {crud.hasEdit && (
                      <Route
                        path=":id"
                        element={createElement(child.props.edit, { ...resourceProps })}
                      />
                    )}
                    {crud.hasShow && (
                      <Route
                        path=":id/show"
                        element={createElement(child.props.show, { ...resourceProps })}
                      />
                    )}
                  </Route>
                )
              }
            }
          })}
          <Route
            index
            element={
              <Navigate
                to={`/${
                  (Children.toArray(props.children)[0] as any)?.props?.overrideName ||
                  (Children.toArray(props.children)[0] as any)?.props?.name
                }`}
                replace
              />
            }
          />
        </Route>
      </Routes>
      <pre>
        {(Children.toArray(props.children)[0] as any)?.props?.overrideName ||
          (Children.toArray(props.children)[0] as any)?.props?.name}
      </pre>

      {background && (
        <Routes>
          {Children.map(props.children, (child: React.ReactNode, index) => {
            if (isValidElement(child) && child.type === Resource && child.props.name) {
              const crud: RouteAvailability = {
                hasCreate: !!child.props.create,
                hasEdit: !!child.props.edit,
                hasShow: !!child.props.show,
                hasList: !!child.props.list,
              }

              const resourceProps = {
                resource: child.props.name,
                ...crud,
              }

              if (crud.hasCreate || crud.hasEdit || crud.hasShow) {
                return (
                  <Route
                    path={child.props.overrideName || child.props.name}
                    element={<ModalLayout />}
                  >
                    {crud.hasCreate && (
                      <Route
                        path="create"
                        element={createElement(child.props.create, { ...resourceProps })}
                      />
                    )}
                    {crud.hasEdit && (
                      <Route
                        path=":id"
                        element={createElement(child.props.edit, { ...resourceProps })}
                      />
                    )}
                    {crud.hasShow && (
                      <Route
                        path=":id/show"
                        element={createElement(child.props.show, { ...resourceProps })}
                      />
                    )}
                  </Route>
                )
              }
            }
          })}
        </Routes>
      )}

      {/* <Route
        path="/"
        element={
          <Layout>
            <Routes location={background || location}>
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
                        element={() => {
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
                        element={({ match: { params } }) => {
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
                        element={() => {
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
              <Navigate to={`/${(Children.toArray(props.children)[0] as any).props.name}`} />
            </Routes>

            {background && (
              <Routes>
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
                          element={({ match: { params } }) => {
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
              </Routes>
            )}
          </Layout>
        }
      /> */}
    </>
  )
}
