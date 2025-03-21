import { AuthStore } from './auth.store';
import { TestBed, fakeAsync, flush } from '@angular/core/testing';
import { AuthService } from '../services/auth.service';
import { User } from '../models/user.model';

jest.mock('../../utils/fakeDelay', () => ({
  fakeDelay: jest.fn().mockResolvedValue(true),
}));

describe('AuthStore', () => {
  let store: any;
  let authServiceMock: jest.Mocked<AuthService>;

  const mockUser: User = {
    id: '1',
    firstname: 'Agent',
    lastname: 'M',
    email: 'directeur@agence-secrete.gov',
    avatar: 'https://placecats.com/300/200',
  };

  let localStorageMock: { [key: string]: string } = {};

  beforeEach(() => {
    localStorageMock = {};

    jest
      .spyOn(window.localStorage, 'getItem')
      .mockImplementation((key) => localStorageMock[key] || null);
    jest
      .spyOn(window.localStorage, 'setItem')
      .mockImplementation((key, value) => {
        localStorageMock[key] = value;
      });
    jest.spyOn(window.localStorage, 'removeItem').mockImplementation((key) => {
      delete localStorageMock[key];
    });

    authServiceMock = {
      login: jest.fn(),
      getUserByToken: jest.fn(),
    } as unknown as jest.Mocked<AuthService>;

    TestBed.configureTestingModule({
      providers: [
        AuthStore,
        { provide: AuthService, useValue: authServiceMock },
      ],
    });

    store = TestBed.inject(AuthStore);
  });

  it('should have the correct initial state', () => {
    expect(store.user()).toBeNull();
    expect(store.isAuthenticated()).toBe(false);
    expect(store.isLoading()).toBe(true);
  });

  describe('init', () => {
    it('should initialize the user from the stored token', async () => {
      localStorageMock['token'] = 'valid.token';
      authServiceMock.getUserByToken.mockResolvedValue(mockUser);

      await store.init();

      expect(authServiceMock.getUserByToken).toHaveBeenCalledWith(
        'valid.token'
      );
      expect(store.user()).toEqual(mockUser);
      expect(store.isAuthenticated()).toBe(true);
      expect(store.isLoading()).toBe(false);
    });

    it('should delete the token if the user is not found', async () => {
      localStorageMock['token'] = 'invalid.token';
      authServiceMock.getUserByToken.mockResolvedValue(null);

      await store.init();

      expect(authServiceMock.getUserByToken).toHaveBeenCalledWith(
        'invalid.token'
      );
      expect(store.user()).toBeNull();
      expect(store.isAuthenticated()).toBe(false);
      expect(store.isLoading()).toBe(false);
      expect(localStorage.removeItem).toHaveBeenCalledWith('token');
    });

    it('should handle the case where no token is present', async () => {
      await store.init();

      expect(authServiceMock.getUserByToken).not.toHaveBeenCalled();
      expect(store.user()).toBeNull();
      expect(store.isAuthenticated()).toBe(false);
      expect(store.isLoading()).toBe(false);
    });
  });

  describe('logout', () => {
    it('should disconnect the user and delete the token', () => {
      localStorageMock['token'] = 'some.token';

      store.logout();

      expect(localStorage.removeItem).toHaveBeenCalledWith('token');
      expect(store.user()).toBeNull();
      expect(store.isAuthenticated()).toBe(false);
    });
  });

  describe('login', () => {
    it('should authenticate the user and store the token', async () => {
      const loginResponse = {
        token: 'new.token',
        user: mockUser,
      };
      authServiceMock.login.mockResolvedValue(loginResponse);

      await store.login({
        email: 'directeur@agence-secrete.gov',
        password: 'secret',
      });

      expect(authServiceMock.login).toHaveBeenCalledWith({
        email: 'directeur@agence-secrete.gov',
        password: 'secret',
      });
      expect(localStorage.setItem).toHaveBeenCalledWith('token', 'new.token');
      expect(store.user()).toEqual(mockUser);
      expect(store.isAuthenticated()).toBe(true);
    });

    it('should use fakeDelay to simulate a network delay', fakeAsync(() => {
      const loginResponse = {
        token: 'new.token',
        user: mockUser,
      };
      authServiceMock.login.mockResolvedValue(loginResponse);

      const loginPromise = store.login({
        email: 'test@example.com',
        password: 'password',
      });

      expect(store.isAuthenticated()).toBe(false);

      flush();

      return loginPromise.then(() => {
        expect(store.isAuthenticated()).toBe(true);
        expect(store.user()).toEqual(mockUser);
      });
    }));
  });
});
