import { AuthProvider, DefaultUserIdentity } from 'chakra-admin'

export class ExampleAuthProvider implements AuthProvider {

  init() {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async login(params: Record<string, any>) {
    try {
      window.localStorage.setItem('auth', JSON.stringify(params))
      return Promise.resolve()
    } catch (e) {
      return Promise.reject()
    }
  }

  async checkError(params: { status?: number }): Promise<void> {
    if (params.status === 401 || params.status === 403) {
      return Promise.reject()
    }

    Promise.resolve()
  }

  async checkAuth() {
    const auth = window.localStorage.getItem('auth')

    if (auth) {
      return Promise.resolve()
    }

    throw new Error('Auth error')
  }

  async logout() {
    try {
      window.localStorage.removeItem('auth')
      return Promise.resolve()
    } catch (e) {
      return Promise.reject()
    }
  }

  async getIdentity(): Promise<DefaultUserIdentity> {
    const auth = window.localStorage.getItem('auth')

    if (auth) {
      return {
        id: "1",
        username: "admin@admin.it",
        // fullName: `${result.data.adminMe.firstName || ''} ${result.data.adminMe.lastName}`,
        fullName: "Admin",
        // todo avatarUrl
        avatarUrl: 'https://pbs.twimg.com/profile_images/745236379228069888/5Zre6uSy_400x400.jpg',
        // avatarUrl: result?.data?.adminMe?.picture?.urlSmall,
        // roles: result.data.adminMe.roles,
      } as any
    }
    throw new Error('User not found')
  }
}
