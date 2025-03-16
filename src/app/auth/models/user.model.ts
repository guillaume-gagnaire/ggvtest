export interface User {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  role: 'user' | 'manager';
  avatar: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface UserJwtPayload {
  id: string;
}
