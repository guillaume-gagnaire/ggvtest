import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { UserRepository } from '../repositories/user.repository';
import { User, UserJwtPayload } from '../models/user.model';
import * as jose from 'jose';

jest.mock('jose', () => {
  return {
    SignJWT: jest.fn().mockImplementation(() => ({
      setProtectedHeader: jest.fn().mockReturnThis(),
      setExpirationTime: jest.fn().mockReturnThis(),
      sign: jest.fn().mockResolvedValue('fake.jwt.token'),
    })),
    jwtVerify: jest.fn(),
  };
});

describe('AuthService', () => {
  let service: AuthService;
  let userRepositoryMock: jest.Mocked<UserRepository>;

  const mockUser: User = {
    id: '1',
    firstname: 'Agent',
    lastname: 'M',
    email: 'directeur@agence-secrete.gov',
    avatar: 'https://placecats.com/300/200',
  };

  beforeEach(async () => {
    userRepositoryMock = {
      getUserByEmail: jest.fn(),
      getUserById: jest.fn(),
      getAllUsers: jest.fn(),
      updateUser: jest.fn(),
      initializeStorage: jest.fn().mockResolvedValue(undefined),
    } as unknown as jest.Mocked<UserRepository>;

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: UserRepository, useValue: userRepositoryMock },
      ],
    });

    service = TestBed.inject(AuthService);
  });

  it('devrait être créé', () => {
    expect(service).toBeTruthy();
  });

  describe('login', () => {
    it('should return a token and a user for valid credentials', async () => {
      userRepositoryMock.getUserByEmail.mockReturnValue(mockUser);

      const result = await service.login({
        email: 'directeur@agence-secrete.gov',
        password: 'password123',
      });

      expect(userRepositoryMock.getUserByEmail).toHaveBeenCalledWith(
        'directeur@agence-secrete.gov'
      );
      expect(jose.SignJWT).toHaveBeenCalledWith({ id: '1' });
      expect(result).toEqual({
        token: 'fake.jwt.token',
        user: mockUser,
      });
    });

    it("should throw an error if the user doesn't exist", async () => {
      userRepositoryMock.getUserByEmail.mockReturnValue(null);

      await expect(
        service.login({ email: 'inconnu@email.com', password: 'password123' })
      ).rejects.toThrow(
        'Accès refusé, des agents de suppression ont été envoyés à votre position'
      );
    });
  });

  describe('getUserByToken', () => {
    it('should return a user for a valid token', async () => {
      (jose.jwtVerify as jest.Mock).mockResolvedValue({
        payload: { id: '1' } as UserJwtPayload,
        protectedHeader: { alg: 'HS256' },
      });
      userRepositoryMock.getUserById.mockReturnValue(mockUser);

      const result = await service.getUserByToken('valid.jwt.token');

      expect(jose.jwtVerify).toHaveBeenCalled();
      expect(userRepositoryMock.getUserById).toHaveBeenCalledWith('1');
      expect(result).toEqual(mockUser);
    });

    it('should return null if the token verification fails', async () => {
      (jose.jwtVerify as jest.Mock).mockRejectedValue(
        new Error('Invalid token')
      );

      const result = await service.getUserByToken('invalid.jwt.token');

      expect(result).toBeNull();
      expect(userRepositoryMock.getUserById).not.toHaveBeenCalled();
    });

    it("should return null if the user doesn't exist", async () => {
      (jose.jwtVerify as jest.Mock).mockResolvedValue({
        payload: { id: '999' } as UserJwtPayload,
        protectedHeader: { alg: 'HS256' },
      });
      userRepositoryMock.getUserById.mockReturnValue(null);

      const result = await service.getUserByToken('valid.jwt.token');

      expect(userRepositoryMock.getUserById).toHaveBeenCalledWith('999');
      expect(result).toBeNull();
    });
  });
});
