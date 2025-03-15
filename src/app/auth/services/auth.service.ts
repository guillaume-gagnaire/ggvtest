import { Injectable } from '@angular/core'
import { LoginCredentials, LoginResponse, User } from '../models/user.model'
import { UserRepository } from '../repositories/user.repository'
import * as jose from 'jose'

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly JWT_SECRET = 'secret' // Normalement, ce process est géré par le serveur, patapé

  constructor (private readonly userRepository: UserRepository) {}

  async login (credentials: LoginCredentials): Promise<LoginResponse> {
    const user = this.userRepository.getUserByEmail(credentials.email)
    if (!user) {
      throw new Error('Accès refusé, des agents de suppression ont été envoyés')
    }

    return {
      token: await new jose.SignJWT({ id: user.id })
        .setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime('2h')
        .sign(new TextEncoder().encode(this.JWT_SECRET)),
      user
    }
  }

  async getUserByToken (token: string): Promise<User | null> {
    const { payload } = await jose.jwtVerify<{ id: string }>(
      token,
      new TextEncoder().encode(this.JWT_SECRET)
    )
    return this.userRepository.getUserById(payload.id)
  }
}
