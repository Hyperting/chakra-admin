import React, { Children, cloneElement, createElement, FC, isValidElement, ReactElement, useMemo } from 'react'
import { Navigate, Routes, useParams, Route as ReactRouterRoute } from 'react-router-dom'
import { AuthProvider } from '../../core/auth/AuthProvider'
import { ClassType } from '../../core/ClassType'
import { RouteLayout } from '../layout/RouteLayout'
import { Resource } from './Resource'
import { Login } from '../login/Login'
import { useAdminCore } from '../../core/admin/useAdminCore'
import { Loading } from './Loading'
import { RouteAvailability } from '../../core/admin/RouteAvailability.js'
import { GlobalStrategy } from '../../core/admin/Strategy'
import { ModalRouteLayout } from '../modal/ModalRouteLayout'
import { RequireAuth } from './RequireAuth'
import { Middleware, RouteMiddleware } from './RouteMiddleware'
import { Route } from './Route'

export type AdminCoreProps = {
  layoutComponent?: React.ReactNode
  modalComponent?: React.ReactNode
  loginComponent?: React.ReactNode
  authProvider?: ClassType<AuthProvider>
  strategy?: ClassType<GlobalStrategy>
  routeMiddleware?: Middleware
  children?: React.ReactNode
}

const WithIdParam: FC<{ children?: React.ReactNode }> = ({ children }) => {
  const { id } = useParams()
  return cloneElement(Children.only(children) as React.ReactElement, {
    id,
  })
}

export const AdminCore: FC<AdminCoreProps> = (props) => {
  const {
    loginComponent = <Login />,
    layoutComponent = <RouteLayout />,
    modalComponent = <ModalRouteLayout />,
    strategy,
    authProvider,
    routeMiddleware,
  } = props

  if (Children.count(props.children) === 0) {
    throw new Error('Admin has no children')
  }

  const { initialized, location, background } = useAdminCore(props)

  const hasIndex = useMemo(
    () =>
      Children.toArray(props.children).filter((c: any) => c.type === Route && (c.props?.index || c.props?.path === '/'))
        .length > 0,
    [props.children]
  )

  const insideAdminRoutes = useMemo(() => {
    return Children.toArray(props.children).filter(
      (r) =>
        ((r as ReactElement).type === Route || (r as ReactElement).type === ReactRouterRoute) &&
        !!(r as ReactElement).props?.useAdminLayout
    )
  }, [props.children])

  const outsideAdminRoutes = useMemo(() => {
    return Children.toArray(props.children).filter(
      (r) =>
        ((r as ReactElement).type === Route || (r as ReactElement).type === ReactRouterRoute) &&
        !(r as ReactElement).props?.useAdminLayout
    )
  }, [props.children])

  if (!initialized) {
    return <Loading />
  }

  return (
    <>
      <Routes location={background || location}>
        {isValidElement(loginComponent) && <ReactRouterRoute path="login" element={cloneElement(loginComponent, {})} />}

        {Children.map(outsideAdminRoutes, (child: React.ReactNode, index) => {
          if (isValidElement(child)) {
            const { useAdminLayout, ...rest } = child.props
            return createElement(ReactRouterRoute, {
              key: `outer-route-${index}`,
              ...rest,
            })
          }
          return null
        })}

        <ReactRouterRoute path="" element={layoutComponent}>
          {Children.map(insideAdminRoutes, (child: React.ReactNode, index) => {
            if (isValidElement(child)) {
              const { useAdminLayout, ...rest } = child.props
              return createElement(ReactRouterRoute, {
                key: `inner-route-${index}`,
                ...rest,
              })
              // return cloneElement(child, {
              //   key: `inner-route-${index}`,
              // })
            }
            return null
          })}

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
                  <ReactRouterRoute path={child.props.overrideName || child.props.name}>
                    {crud.hasList && (
                      <ReactRouterRoute
                        index
                        element={
                          <RequireAuth skip={!authProvider}>
                            <RouteMiddleware middleware={routeMiddleware || child.props.routeMiddleware}>
                              {createElement(child.props.list, { ...resourceProps })}
                            </RouteMiddleware>
                          </RequireAuth>
                        }
                      />
                    )}
                    {crud.hasCreate && (
                      <ReactRouterRoute
                        path="create/*"
                        element={
                          <RequireAuth skip={!authProvider}>
                            <RouteMiddleware middleware={routeMiddleware || child.props.routeMiddleware}>
                              {createElement(child.props.create, { ...resourceProps })}
                            </RouteMiddleware>
                          </RequireAuth>
                        }
                      />
                    )}
                    {crud.hasEdit && (
                      <ReactRouterRoute
                        path=":id/*"
                        element={
                          <RequireAuth skip={!authProvider}>
                            <RouteMiddleware middleware={routeMiddleware || child.props.routeMiddleware}>
                              <WithIdParam>{createElement(child.props.edit, { ...resourceProps })}</WithIdParam>
                            </RouteMiddleware>
                          </RequireAuth>
                        }
                      />
                    )}
                    {crud.hasShow && (
                      <ReactRouterRoute
                        path=":id/show/*"
                        element={
                          <RequireAuth skip={!authProvider}>
                            <RouteMiddleware middleware={routeMiddleware || child.props.routeMiddleware}>
                              <WithIdParam>{createElement(child.props.show, { ...resourceProps })}</WithIdParam>
                            </RouteMiddleware>
                          </RequireAuth>
                        }
                      />
                    )}
                  </ReactRouterRoute>
                )
              }
            }
          })}
          {!hasIndex && (
            <ReactRouterRoute
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
          )}
        </ReactRouterRoute>
      </Routes>

      {background && (
        <Routes>
          {Children.map(outsideAdminRoutes, (child: React.ReactNode, index) => {
            if (isValidElement(child)) {
              const { useAdminLayout, ...rest } = child.props
              return createElement(ReactRouterRoute, {
                key: `outer-route-${index}`,
                ...rest,
              })
            }
            return null
          })}
          {Children.map(insideAdminRoutes, (child: React.ReactNode, index) => {
            if (isValidElement(child)) {
              const { useAdminLayout, ...rest } = child.props
              return createElement(ReactRouterRoute, {
                key: `outer-route-${index}`,
                ...rest,
              })
            }
            return null
          })}

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
                renderingInModal: true,
                ...crud,
              }

              if (crud.hasCreate || crud.hasEdit || crud.hasShow) {
                return (
                  <ReactRouterRoute path={child.props.overrideName || child.props.name} element={modalComponent}>
                    {crud.hasCreate && (
                      <ReactRouterRoute
                        path="create"
                        element={
                          <RequireAuth skip={!authProvider}>
                            <RouteMiddleware middleware={routeMiddleware || child.props.routeMiddleware}>
                              {createElement(child.props.create, { ...resourceProps })}
                            </RouteMiddleware>
                          </RequireAuth>
                        }
                      />
                    )}
                    {crud.hasEdit && (
                      <ReactRouterRoute
                        path=":id"
                        element={
                          <RequireAuth skip={!authProvider}>
                            <RouteMiddleware middleware={routeMiddleware || child.props.routeMiddleware}>
                              <WithIdParam>{createElement(child.props.edit, { ...resourceProps })}</WithIdParam>
                            </RouteMiddleware>
                          </RequireAuth>
                        }
                      />
                    )}
                    {crud.hasShow && (
                      <ReactRouterRoute
                        path=":id/show"
                        element={
                          <RequireAuth skip={!authProvider}>
                            <RouteMiddleware middleware={routeMiddleware || child.props.routeMiddleware}>
                              <WithIdParam>{createElement(child.props.show, { ...resourceProps })}</WithIdParam>
                            </RouteMiddleware>
                          </RequireAuth>
                        }
                      />
                    )}
                  </ReactRouterRoute>
                )
              }
            }
          })}
        </Routes>
      )}
    </>
  )
}
