import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { LoginCredentials, User } from '../models/user.model';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { fakeDelay } from '../../utils/fakeDelay';

type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
};

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
};

export const AuthStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store) => {
    const authService = inject(AuthService);
    const localStorageKey = 'token';

    return {
      async init() {
        const token = localStorage.getItem(localStorageKey);
        if (token) {
          const user = await authService.getUserByToken(token);
          if (user) {
            patchState(store, () => ({
              user: user,
              isAuthenticated: true,
            }));
          } else {
            localStorage.removeItem(localStorageKey);
          }
        }
        patchState(store, () => ({
          isLoading: false,
        }));
      },
      logout() {
        localStorage.removeItem(localStorageKey);
        patchState(store, () => ({
          user: null,
          isAuthenticated: false,
        }));
      },
      async login(credentials: LoginCredentials) {
        await fakeDelay(1766);
        const response = await authService.login(credentials);
        localStorage.setItem(localStorageKey, response.token);
        patchState(store, () => ({
          user: response.user,
          isAuthenticated: true,
        }));
      },
    };
  })
);
