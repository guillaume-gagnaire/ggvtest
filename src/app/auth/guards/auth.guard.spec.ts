import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { authGuard } from './auth.guard';

/**
 * Mocks
 */
const routerMock = {
  navigate: jest.fn(),
};

const authStoreMock = {
  isLoading: jest.fn(),
  isAuthenticated: jest.fn(),
  init: jest.fn().mockResolvedValue(undefined),
};

jest.mock('@angular/core', () => ({
  ...jest.requireActual('@angular/core'),
  inject: (token: any) => {
    if (token === Router) {
      return routerMock;
    }
    return authStoreMock;
  },
}));

/**
 * Tests
 */
describe('authGuard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return true when user is authenticated', async () => {
    authStoreMock.isLoading.mockReturnValue(false);
    authStoreMock.isAuthenticated.mockReturnValue(true);

    const route = {} as ActivatedRouteSnapshot;
    const state = { url: '/protected' } as RouterStateSnapshot;

    const result = await authGuard(route, state);

    expect(result).toBe(true);
    expect(routerMock.navigate).not.toHaveBeenCalled();
  });

  it('should redirect to login and return false when user is not authenticated', async () => {
    authStoreMock.isLoading.mockReturnValue(false);
    authStoreMock.isAuthenticated.mockReturnValue(false);

    const route = {} as ActivatedRouteSnapshot;
    const state = { url: '/protected' } as RouterStateSnapshot;

    const result = await authGuard(route, state);

    expect(result).toBe(false);
    expect(routerMock.navigate).toHaveBeenCalledWith(['/login'], {
      queryParams: { redirectUrl: '/protected' },
    });
  });

  it('should wait for store to initialize when loading', async () => {
    authStoreMock.isLoading.mockReturnValue(true);
    authStoreMock.isAuthenticated.mockReturnValue(true);

    const route = {} as ActivatedRouteSnapshot;
    const state = { url: '/protected' } as RouterStateSnapshot;

    const result = await authGuard(route, state);

    expect(authStoreMock.init).toHaveBeenCalled();
    expect(result).toBe(true);
  });
});
