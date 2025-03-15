import { Injectable } from '@angular/core';
import {
  LoginCredentials,
  LoginResponse,
  User,
  UserJwtPayload,
} from '../models/user.model';
import { UserRepository } from '../repositories/user.repository';
import * as jose from 'jose';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // Normalement, ce process est géré par le serveur, patapé
  private readonly JWT_SECRET = 'secret';

  constructor(private readonly userRepository: UserRepository) {}

  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const user = this.userRepository.getUserByEmail(credentials.email);
    if (!user) {
      throw new Error(
        'Accès refusé, des agents de suppression ont été envoyés à votre position'
      );
    }

    const token = await new jose.SignJWT({
      id: user.id,
    } satisfies UserJwtPayload)
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('2h')
      .sign(new TextEncoder().encode(this.JWT_SECRET));

    return {
      token,
      user,
    };
  }

  async getUserByToken(token: string): Promise<User | null> {
    try {
      const { payload } = await jose.jwtVerify<UserJwtPayload>(
        token,
        new TextEncoder().encode(this.JWT_SECRET)
      );
      return this.userRepository.getUserById(payload.id);
    } catch (error) {
      return null;
    }
  }
}
