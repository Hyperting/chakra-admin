import React, { Children, cloneElement, createElement, FC, isValidElement } from 'react'
import { Navigate, Route, Routes, useParams } from 'react-router-dom'
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

export type AdminCoreProps = {
  layoutComponent?: React.ReactNode
  modalComponent?: React.ReactNode
  loginComponent?: React.ReactNode
  authProvider?: ClassType<AuthProvider>
  strategy?: ClassType<GlobalStrategy>
  children?: React.ReactNode
}

const WithIdParam: FC = ({ children }) => {
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
  } = props

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
          <Route path="login" element={cloneElement(loginComponent, {})} />
        )}

        {Children.map(props.children, (child: React.ReactNode, index) => {
          if (isValidElement(child) && child.type === Route) {
            return cloneElement(child, {
              key: `route-${index}`,
            })
          }
          return null
        })}

        <Route path="" element={layoutComponent}>
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
                        path="create/*"
                        element={createElement(child.props.create, { ...resourceProps })}
                      />
                    )}
                    {crud.hasEdit && (
                      <Route
                        path=":id/*"
                        element={
                          <WithIdParam>
                            {createElement(child.props.edit, { ...resourceProps })}
                          </WithIdParam>
                        }
                      />
                    )}
                    {crud.hasShow && (
                      <Route
                        path=":id/show/*"
                        element={
                          <WithIdParam>
                            {createElement(child.props.show, { ...resourceProps })}
                          </WithIdParam>
                        }
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
                renderingInModal: true,
                ...crud,
              }

              if (crud.hasCreate || crud.hasEdit || crud.hasShow) {
                return (
                  <Route
                    path={child.props.overrideName || child.props.name}
                    element={modalComponent}
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
                        element={
                          <WithIdParam>
                            {createElement(child.props.edit, { ...resourceProps })}
                          </WithIdParam>
                        }
                      />
                    )}
                    {crud.hasShow && (
                      <Route
                        path=":id/show"
                        element={
                          <WithIdParam>
                            {createElement(child.props.show, { ...resourceProps })}
                          </WithIdParam>
                        }
                      />
                    )}
                  </Route>
                )
              }
            }
          })}
        </Routes>
      )}
    </>
  )
}
