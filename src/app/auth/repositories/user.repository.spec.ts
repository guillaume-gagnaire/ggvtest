import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { UserRepository } from './user.repository';
import { StorageService } from '../../services/storage.service';
import { User } from '../models/user.model';

describe('UserRepository', () => {
  let repository: UserRepository;
  let storageServiceSpy: jest.Mocked<StorageService>;

  const mockUsers: User[] = [
    {
      id: '1',
      firstname: 'Agent',
      lastname: 'M',
      email: 'directeur@agence-secrete.gov',
      avatar: 'https://placecats.com/300/200',
    },
    {
      id: '2',
      firstname: 'James',
      lastname: 'Bond',
      email: 'james.bond@mi6.uk',
      avatar: 'https://placecats.com/300/300',
    },
  ];

  describe('with empty storage', () => {
    beforeEach(async () => {
      const spy = {
        get: jest.fn().mockReturnValue(null),
        store: jest.fn(),
      } as jest.Mocked<StorageService>;

      TestBed.configureTestingModule({
        providers: [UserRepository, { provide: StorageService, useValue: spy }],
      });

      repository = TestBed.inject(UserRepository);
      storageServiceSpy = TestBed.inject(
        StorageService
      ) as jest.Mocked<StorageService>;

      // Attendre que l'initialisation asynchrone soit terminée
      await new Promise(process.nextTick);
    });

    it('should initialize with demo users when storage is empty', () => {
      expect(storageServiceSpy.store).toHaveBeenCalledWith(
        'users',
        expect.arrayContaining([
          expect.objectContaining({
            id: '1',
            email: 'directeur@agence-secrete.gov',
          }),
        ])
      );

      const users = repository.getAllUsers();
      expect(users.length).toBe(1);
      expect(users[0].email).toBe('directeur@agence-secrete.gov');
    });
  });

  describe('with existing storage', () => {
    beforeEach(async () => {
      const spy = {
        get: jest.fn().mockReturnValue(mockUsers),
        store: jest.fn(),
      } as jest.Mocked<StorageService>;

      TestBed.configureTestingModule({
        providers: [UserRepository, { provide: StorageService, useValue: spy }],
      });

      repository = TestBed.inject(UserRepository);
      storageServiceSpy = TestBed.inject(
        StorageService
      ) as jest.Mocked<StorageService>;

      // Attendre que l'initialisation asynchrone soit terminée
      await new Promise(process.nextTick);
    });

    it('should load existing users from storage', () => {
      const users = repository.getAllUsers();
      expect(users.length).toBe(2);
      expect(users).toEqual(mockUsers);
      expect(storageServiceSpy.store).not.toHaveBeenCalled();
    });

    it('should return a user by ID', () => {
      const user = repository.getUserById('2');
      expect(user).toEqual(
        expect.objectContaining({
          id: '2',
          firstname: 'James',
          lastname: 'Bond',
        })
      );
    });

    it("should return null if the user doesn't exist", () => {
      const user = repository.getUserById('999');
      expect(user).toBeNull();
    });

    it('should return a user by email', () => {
      const user = repository.getUserByEmail('james.bond@mi6.uk');
      expect(user).toEqual(
        expect.objectContaining({
          id: '2',
          firstname: 'James',
          lastname: 'Bond',
        })
      );
    });

    it("should return null if the email doesn't exist", () => {
      const user = repository.getUserByEmail('inconnu@email.com');
      expect(user).toBeNull();
    });

    it('should update an existing user', () => {
      const updateData: Partial<User> = {
        firstname: 'James Updated',
        avatar: 'https://newphoto.com/avatar.jpg',
      };

      const updatedUser = repository.updateUser('2', updateData);

      expect(updatedUser).not.toBeNull();
      expect(updatedUser?.firstname).toBe('James Updated');
      expect(updatedUser?.avatar).toBe('https://newphoto.com/avatar.jpg');
      expect(updatedUser?.lastname).toBe('Bond');
      expect(storageServiceSpy.store).toHaveBeenCalled();
    });

    it("should return null if the user to update doesn't exist", () => {
      const updatedUser = repository.updateUser('999', { firstname: 'Test' });

      expect(updatedUser).toBeNull();
    });

    it('should propagate the error in case of storage problem', () => {
      storageServiceSpy.store.mockImplementation(() => {
        throw new Error('Erreur de stockage');
      });

      expect(() => {
        repository.updateUser('2', { firstname: 'Test' });
      }).toThrow('Erreur de stockage');
    });
  });
});
