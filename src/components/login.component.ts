import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { LoginRequest } from '../models/user.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="auth-container">
      <div class="auth-card card">
        <div class="card-header text-center">
          <h2>Login to JobTracker</h2>
          <p>Access your account to manage job applications</p>
        </div>
        
        <div class="card-body">
          <form (ngSubmit)="onSubmit()" #loginForm="ngForm">
            <div class="form-group">
              <label class="form-label" for="username">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                class="form-control"
                [(ngModel)]="loginRequest.username"
                required
                #username="ngModel"
                [class.error]="username.invalid && username.touched"
              />
              <div class="error-message" *ngIf="username.invalid && username.touched">
                Username is required
              </div>
            </div>

            <div class="form-group">
              <label class="form-label" for="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                class="form-control"
                [(ngModel)]="loginRequest.password"
                required
                #password="ngModel"
                [class.error]="password.invalid && password.touched"
              />
              <div class="error-message" *ngIf="password.invalid && password.touched">
                Password is required
              </div>
            </div>

            <div class="error-message" *ngIf="errorMessage">
              {{ errorMessage }}
            </div>

            <button
              type="submit"
              class="btn btn-primary w-100 mt-3"
              [disabled]="loginForm.invalid || isLoading"
            >
              <span *ngIf="isLoading" class="spinner"></span>
              <span *ngIf="!isLoading">Login</span>
            </button>
          </form>
        </div>
        
        <div class="card-footer text-center">
          <p>Don't have an account? <a routerLink="/register" class="link">Register here</a></p>
          <p class="demo-info">
            <strong>Demo Accounts:</strong><br>
            Admin: username: <code>admin</code>, password: <code>admin123</code>
          </p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem 1rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    .auth-card {
      width: 100%;
      max-width: 400px;
      margin: 0 auto;
    }

    .card-header h2 {
      color: var(--primary-color);
      margin-bottom: 0.5rem;
    }

    .card-header p {
      color: var(--text-secondary);
      margin-bottom: 0;
    }

    .link {
      color: var(--primary-color);
      text-decoration: none;
      font-weight: 500;
    }

    .link:hover {
      color: var(--primary-dark);
      text-decoration: underline;
    }

    .demo-info {
      margin-top: 1rem;
      padding: 1rem;
      background-color: #f8f9fa;
      border-radius: 6px;
      font-size: 0.875rem;
      line-height: 1.4;
    }

    .demo-info code {
      background-color: #e9ecef;
      padding: 2px 4px;
      border-radius: 3px;
      font-family: monospace;
    }

    .spinner {
      width: 16px;
      height: 16px;
      border: 2px solid transparent;
      border-top: 2px solid currentColor;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      display: inline-block;
      margin-right: 0.5rem;
    }
  `]
})
export class LoginComponent {
  loginRequest: LoginRequest = {
    username: '',
    password: ''
  };

  errorMessage = '';
  isLoading = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    if (this.isLoading) return;

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.loginRequest).subscribe({
      next: (user) => {
        this.isLoading = false;
        if (user.role === 'ADMIN') {
          this.router.navigate(['/admin/jobs']);
        } else {
          this.router.navigate(['/jobs']);
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.message;
      }
    });
  }
}