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
import { GlobalStrategy } from '../../core/admin/Strategy'

export type AdminCoreProps = {
  layoutComponent?: React.ReactNode
  loginComponent?: React.ReactNode
  authProvider?: ClassType<AuthProvider>
  strategy?: ClassType<GlobalStrategy>
  children?: React.ReactNode
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
  const { loginComponent = <Login />, layoutComponent = <Layout />, strategy } = props

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

        {Children.map(props.children, (child: React.ReactNode, index) => {
          if (isValidElement(child) && child.type === Route) {
            return cloneElement(child, {
              key: `route-${index}`,
            })
          }
          return null
        })}

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
    </>
  )
}
