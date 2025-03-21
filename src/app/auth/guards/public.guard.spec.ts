import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { publicGuard } from './public.guard';

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
describe('publicGuard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return true when user is not authenticated', async () => {
    authStoreMock.isLoading.mockReturnValue(false);
    authStoreMock.isAuthenticated.mockReturnValue(false);

    const route = { queryParams: {} } as unknown as ActivatedRouteSnapshot;
    const state = { url: '/login' } as RouterStateSnapshot;

    const result = await publicGuard(route, state);

    expect(result).toBe(true);
    expect(routerMock.navigate).not.toHaveBeenCalled();
  });

  it('should redirect to home and return false when user is authenticated', async () => {
    authStoreMock.isLoading.mockReturnValue(false);
    authStoreMock.isAuthenticated.mockReturnValue(true);

    const route = { queryParams: {} } as unknown as ActivatedRouteSnapshot;
    const state = { url: '/login' } as RouterStateSnapshot;

    const result = await publicGuard(route, state);

    expect(result).toBe(false);
    expect(routerMock.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should redirect to specified redirectUrl when authenticated', async () => {
    authStoreMock.isLoading.mockReturnValue(false);
    authStoreMock.isAuthenticated.mockReturnValue(true);

    const route = {
      queryParams: { redirectUrl: '/dashboard' },
    } as unknown as ActivatedRouteSnapshot;
    const state = { url: '/login' } as RouterStateSnapshot;

    const result = await publicGuard(route, state);

    expect(result).toBe(false);
    expect(routerMock.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('should wait for store to initialize when loading', async () => {
    authStoreMock.isLoading.mockReturnValue(true);
    authStoreMock.isAuthenticated.mockReturnValue(false);

    const route = { queryParams: {} } as unknown as ActivatedRouteSnapshot;
    const state = { url: '/login' } as RouterStateSnapshot;

    const result = await publicGuard(route, state);

    expect(authStoreMock.init).toHaveBeenCalled();
    expect(result).toBe(true);
  });
});
