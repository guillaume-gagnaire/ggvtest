import { patchState, signalStore, withMethods, withState } from '@ngrx/signals'
import { LoginCredentials, User } from '../models/user.model'
import { inject } from '@angular/core'
import { AuthService } from '../services/auth.service'

type AuthState = {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true
}

export const authStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods(store => {
    const authService = inject(AuthService)

    return {
      async init () {
        const token = localStorage.getItem('token')
        if (token) {
          const user = await authService.getUserByToken(token)
          if (user) {
            patchState(store, () => ({
              user: user,
              isAuthenticated: true
            }))
          }
        }
        patchState(store, () => ({
          isLoading: false
        }))
      },
      logout () {
        localStorage.removeItem('token')
        patchState(store, () => ({
          user: null,
          isAuthenticated: false
        }))
      },
      async login (credentials: LoginCredentials) {
        const response = await authService.login(credentials)
        localStorage.setItem('token', response.token)
        patchState(store, () => ({
          user: response.user,
          isAuthenticated: true
        }))
      }
    }
  })
)
