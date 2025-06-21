export interface User {
  id?: number;
  firstName: string;
  middleName?: string;
  lastName: string;
  username: string;
  password: string;
  role: UserRole;
}

export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN'
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  middleName?: string;
  lastName: string;
  username: string;
  password: string;
}