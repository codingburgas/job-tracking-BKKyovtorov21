import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-unauthorized',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="unauthorized-container">
      <div class="container">
        <div class="unauthorized-content">
          <div class="error-icon">🚫</div>
          <h1>Access Denied</h1>
          <p>You don't have permission to access this page.</p>
          <div class="actions">
            <a routerLink="/" class="btn btn-primary">Go Home</a>
            <a routerLink="/login" class="btn btn-outline ml-2">Login</a>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .unauthorized-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: var(--background-color);
    }

    .unauthorized-content {
      text-align: center;
      padding: 3rem 2rem;
    }

    .error-icon {
      font-size: 5rem;
      margin-bottom: 2rem;
    }

    h1 {
      color: var(--error-color);
      margin-bottom: 1rem;
    }

    p {
      font-size: 1.1rem;
      margin-bottom: 2rem;
      max-width: 400px;
      margin-left: auto;
      margin-right: auto;
    }

    .actions {
      display: flex;
      gap: 1rem;
      justify-content: center;
      flex-wrap: wrap;
    }

    @media (max-width: 480px) {
      .actions {
        flex-direction: column;
        align-items: center;
      }
    }
  `]
})
export class UnauthorizedComponent {}