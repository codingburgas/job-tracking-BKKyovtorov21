import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { User } from '../models/user.model';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="navbar">
      <div class="container">
        <div class="d-flex justify-content-between align-items-center">
          <div class="navbar-brand">
            <a routerLink="/" class="brand-link">
              <h3>JobTracker</h3>
            </a>
          </div>
          
          <div class="navbar-menu" *ngIf="currentUser">
            <div class="nav-links">
              <ng-container *ngIf="authService.isUser()">
                <a routerLink="/jobs" routerLinkActive="active" class="nav-link">Browse Jobs</a>
                <a routerLink="/my-applications" routerLinkActive="active" class="nav-link">My Applications</a>
              </ng-container>
              
              <ng-container *ngIf="authService.isAdmin()">
                <a routerLink="/admin/jobs" routerLinkActive="active" class="nav-link">Manage Jobs</a>
                <a routerLink="/admin/applications" routerLinkActive="active" class="nav-link">Applications</a>
              </ng-container>
            </div>
            
            <div class="user-menu">
              <span class="user-name">{{ currentUser.firstName }} {{ currentUser.lastName }}</span>
              <button class="btn btn-outline btn-small ml-2" (click)="logout()">Logout</button>
            </div>
          </div>
          
          <div class="auth-links" *ngIf="!currentUser">
            <a routerLink="/login" class="btn btn-outline mr-2">Login</a>
            <a routerLink="/register" class="btn btn-primary">Register</a>
          </div>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      background-color: var(--surface-color);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      position: sticky;
      top: 0;
      z-index: 1000;
      padding: 1rem 0;
    }

    .brand-link {
      text-decoration: none;
      color: var(--primary-color);
    }

    .brand-link:hover {
      color: var(--primary-dark);
    }

    .navbar-menu {
      display: flex;
      align-items: center;
      gap: 2rem;
    }

    .nav-links {
      display: flex;
      gap: 1.5rem;
    }

    .nav-link {
      text-decoration: none;
      color: var(--text-secondary);
      font-weight: 500;
      padding: 0.5rem 1rem;
      border-radius: 6px;
      transition: all 0.3s ease;
    }

    .nav-link:hover {
      color: var(--primary-color);
      background-color: var(--primary-light);
    }

    .nav-link.active {
      color: var(--primary-color);
      background-color: var(--primary-light);
    }

    .user-menu {
      display: flex;
      align-items: center;
    }

    .user-name {
      font-weight: 500;
      color: var(--text-primary);
    }

    .auth-links {
      display: flex;
      gap: 1rem;
    }

    @media (max-width: 768px) {
      .navbar-menu {
        flex-direction: column;
        gap: 1rem;
      }
      
      .nav-links {
        flex-direction: column;
        gap: 0.5rem;
      }
      
      .user-menu {
        flex-direction: column;
        gap: 0.5rem;
        text-align: center;
      }
    }
  `]
})
export class NavbarComponent {
  currentUser: User | null = null;

  constructor(
    public authService: AuthService,
    private router: Router
  ) {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}