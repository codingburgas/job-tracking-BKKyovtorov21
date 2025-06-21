import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { User, UserRole, LoginRequest, RegisterRequest } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private users: User[] = [
    {
      id: 1,
      firstName: 'Admin',
      lastName: 'User',
      username: 'admin',
      password: 'admin123',
      role: UserRole.ADMIN
    }
  ];

  private nextUserId = 2;

  constructor() {
    // Check for stored user on service initialization
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      this.currentUserSubject.next(JSON.parse(storedUser));
    }
  }

  login(loginRequest: LoginRequest): Observable<User> {
    const user = this.users.find(u => 
      u.username === loginRequest.username && u.password === loginRequest.password
    );

    if (user) {
      const userWithoutPassword = { ...user, password: '' };
      localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
      this.currentUserSubject.next(userWithoutPassword);
      return of(userWithoutPassword);
    } else {
      return throwError(() => new Error('Invalid username or password'));
    }
  }

  register(registerRequest: RegisterRequest): Observable<User> {
    // Check if username already exists
    const existingUser = this.users.find(u => u.username === registerRequest.username);
    if (existingUser) {
      return throwError(() => new Error('Username already exists'));
    }

    const newUser: User = {
      id: this.nextUserId++,
      ...registerRequest,
      role: UserRole.USER
    };

    this.users.push(newUser);
    
    const userWithoutPassword = { ...newUser, password: '' };
    localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
    this.currentUserSubject.next(userWithoutPassword);
    
    return of(userWithoutPassword);
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  }

  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.role === UserRole.ADMIN;
  }

  isUser(): boolean {
    const user = this.getCurrentUser();
    return user?.role === UserRole.USER;
  }
}