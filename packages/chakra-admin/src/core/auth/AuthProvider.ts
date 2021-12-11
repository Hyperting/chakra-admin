export interface DefaultUserIdentity {
  id: string
  email: string
  fullName: string
  avatarUrl?: string
  [prop: string]: any
}

export interface AuthProvider<
  LoginParams = Record<string, any>,
  UserIdentity = DefaultUserIdentity
> {
  init: () => void
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  login: (params: LoginParams) => Promise<void>
  checkError: (error: { status?: number }) => Promise<void>
  checkAuth: () => Promise<void>
  logout: () => Promise<void>
  getIdentity: () => Promise<UserIdentity>
}
