import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { RegisterRequest } from '../models/user.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="auth-container">
      <div class="auth-card card">
        <div class="card-header text-center">
          <h2>Create Your Account</h2>
          <p>Join JobTracker to find your next opportunity</p>
        </div>
        
        <div class="card-body">
          <form (ngSubmit)="onSubmit()" #registerForm="ngForm">
            <div class="form-group">
              <label class="form-label" for="firstName">First Name</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                class="form-control"
                [(ngModel)]="registerRequest.firstName"
                required
                #firstName="ngModel"
                [class.error]="firstName.invalid && firstName.touched"
              />
              <div class="error-message" *ngIf="firstName.invalid && firstName.touched">
                First name is required
              </div>
            </div>

            <div class="form-group">
              <label class="form-label" for="middleName">Middle Name (Optional)</label>
              <input
                type="text"
                id="middleName"
                name="middleName"
                class="form-control"
                [(ngModel)]="registerRequest.middleName"
              />
            </div>

            <div class="form-group">
              <label class="form-label" for="lastName">Last Name</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                class="form-control"
                [(ngModel)]="registerRequest.lastName"
                required
                #lastName="ngModel"
                [class.error]="lastName.invalid && lastName.touched"
              />
              <div class="error-message" *ngIf="lastName.invalid && lastName.touched">
                Last name is required
              </div>
            </div>

            <div class="form-group">
              <label class="form-label" for="username">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                class="form-control"
                [(ngModel)]="registerRequest.username"
                required
                minlength="3"
                #username="ngModel"
                [class.error]="username.invalid && username.touched"
              />
              <div class="error-message" *ngIf="username.invalid && username.touched">
                <span *ngIf="username.errors?.['required']">Username is required</span>
                <span *ngIf="username.errors?.['minlength']">Username must be at least 3 characters</span>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label" for="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                class="form-control"
                [(ngModel)]="registerRequest.password"
                required
                minlength="6"
                #password="ngModel"
                [class.error]="password.invalid && password.touched"
              />
              <div class="error-message" *ngIf="password.invalid && password.touched">
                <span *ngIf="password.errors?.['required']">Password is required</span>
                <span *ngIf="password.errors?.['minlength']">Password must be at least 6 characters</span>
              </div>
            </div>

            <div class="error-message" *ngIf="errorMessage">
              {{ errorMessage }}
            </div>

            <button
              type="submit"
              class="btn btn-primary w-100 mt-3"
              [disabled]="registerForm.invalid || isLoading"
            >
              <span *ngIf="isLoading" class="spinner"></span>
              <span *ngIf="!isLoading">Create Account</span>
            </button>
          </form>
        </div>
        
        <div class="card-footer text-center">
          <p>Already have an account? <a routerLink="/login" class="link">Login here</a></p>
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
export class RegisterComponent {
  registerRequest: RegisterRequest = {
    firstName: '',
    middleName: '',
    lastName: '',
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

    this.authService.register(this.registerRequest).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/jobs']);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.message;
      }
    });
  }
}