import { Injectable, signal } from '@angular/core';
import { User } from '../models/user.model';
import { StorageService } from '../../services/storage.service';

@Injectable({
  providedIn: 'root',
})
export class UserRepository {
  private readonly STORAGE_KEY = 'users';
  private readonly DEMO_USERS: User[] = [
    {
      id: '1',
      firstname: 'Agent',
      lastname: 'M',
      email: 'directeur@agence-secrete.gov',
      avatar: 'https://placecats.com/300/200',
    },
  ];

  private users = signal<User[]>([]);

  constructor(private readonly storageService: StorageService) {
    this.initializeStorage();
  }

  /**
   * Initialise le stockage avec des données de démonstration si nécessaire
   */
  private async initializeStorage(): Promise<void> {
    const storedUsers = this.storageService.get(this.STORAGE_KEY);
    if (!storedUsers || storedUsers.length === 0) {
      this.storageService.store(this.STORAGE_KEY, this.DEMO_USERS);
      this.users.set(this.DEMO_USERS);
    } else {
      this.users.set(storedUsers);
    }
  }

  /**
   * Récupère tous les utilisateurs
   */
  getAllUsers(): User[] {
    return this.users();
  }

  /**
   * Récupère un utilisateur par son ID
   */
  getUserById(id: string): User | null {
    return this.users().find((user) => user.id === id) || null;
  }

  /**
   * Récupère un utilisateur par son email
   */
  getUserByEmail(email: string): User | null {
    return this.users().find((user) => user.email === email) || null;
  }

  /**
   * Met à jour un utilisateur existant
   */
  updateUser(id: string, userData: Partial<User>): User | null {
    try {
      let updatedUser: User | null = null;

      this.users.update((users) => {
        const index = users.findIndex((user) => user.id === id);
        if (index === -1) return users;

        updatedUser = { ...users[index], ...userData };
        const updatedUsers = [...users];
        updatedUsers[index] = updatedUser;

        return updatedUsers;
      });

      if (updatedUser) {
        this.storageService.store(this.STORAGE_KEY, this.users());
      }

      return updatedUser;
    } catch (error) {
      console.error(
        `Erreur lors de la mise à jour de l'utilisateur ${id}:`,
        error
      );
      throw error;
    }
  }
}
