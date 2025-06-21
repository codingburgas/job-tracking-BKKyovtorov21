import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="hero-section">
      <div class="container">
        <div class="hero-content text-center">
          <h1 class="hero-title">Find Your Dream Job</h1>
          <p class="hero-subtitle">
            Connect with top employers and discover opportunities that match your skills and aspirations.
            Our platform makes job searching simple and efficient.
          </p>
          
          <div class="hero-actions" *ngIf="!authService.isAuthenticated()">
            <a routerLink="/register" class="btn btn-primary btn-large mr-2">Get Started</a>
            <a routerLink="/login" class="btn btn-outline btn-large">Login</a>
          </div>
          
          <div class="hero-actions" *ngIf="authService.isAuthenticated()">
            <a routerLink="/jobs" class="btn btn-primary btn-large" *ngIf="authService.isUser()">Browse Jobs</a>
            <a routerLink="/admin/jobs" class="btn btn-primary btn-large" *ngIf="authService.isAdmin()">Admin Panel</a>
          </div>
        </div>
      </div>
    </div>

    <div class="features-section">
      <div class="container">
        <h2 class="text-center mb-4">Why Choose JobTracker?</h2>
        
        <div class="features-grid">
          <div class="feature-card card">
            <div class="card-body text-center">
              <div class="feature-icon">🎯</div>
              <h4>Targeted Job Search</h4>
              <p>Find jobs that match your skills and preferences with our advanced filtering system.</p>
            </div>
          </div>
          
          <div class="feature-card card">
            <div class="card-body text-center">
              <div class="feature-icon">📊</div>
              <h4>Application Tracking</h4>
              <p>Keep track of all your applications and their status in one convenient dashboard.</p>
            </div>
          </div>
          
          <div class="feature-card card">
            <div class="card-body text-center">
              <div class="feature-icon">🏢</div>
              <h4>Top Companies</h4>
              <p>Connect with leading companies and startups looking for talented professionals.</p>
            </div>
          </div>
          
          <div class="feature-card card">
            <div class="card-body text-center">
              <div class="feature-icon">⚡</div>
              <h4>Quick Applications</h4>
              <p>Apply to multiple jobs quickly with our streamlined application process.</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="stats-section">
      <div class="container">
        <div class="stats-grid text-center">
          <div class="stat-item">
            <h3 class="stat-number">500+</h3>
            <p class="stat-label">Active Jobs</p>
          </div>
          <div class="stat-item">
            <h3 class="stat-number">1000+</h3>
            <p class="stat-label">Registered Users</p>
          </div>
          <div class="stat-item">
            <h3 class="stat-number">250+</h3>
            <p class="stat-label">Companies</p>
          </div>
          <div class="stat-item">
            <h3 class="stat-number">95%</h3>
            <p class="stat-label">Success Rate</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .hero-section {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 8rem 0 6rem;
      text-align: center;
    }

    .hero-title {
      font-size: 3.5rem;
      font-weight: 700;
      margin-bottom: 1.5rem;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .hero-subtitle {
      font-size: 1.25rem;
      margin-bottom: 3rem;
      max-width: 600px;
      margin-left: auto;
      margin-right: auto;
      line-height: 1.6;
      color: white;
      opacity: 0.7;
    }

    .hero-actions {
      display: flex;
      gap: 1rem;
      justify-content: center;
      flex-wrap: wrap;
    }

    .features-section {
      padding: 6rem 0;
      background-color: var(--surface-color);
    }

    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 2rem;
      margin-top: 3rem;
    }

    .feature-card {
      text-align: center;
      transition: transform 0.3s ease;
    }

    .feature-card:hover {
      transform: translateY(-5px);
    }

    .feature-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
    }

    .feature-card h4 {
      color: var(--primary-color);
      margin-bottom: 1rem;
    }

    .stats-section {
      background-color: var(--primary-color);
      color: white;
      padding: 4rem 0;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 2rem;
    }

    .stat-number {
      font-size: 3rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
      color: white;
    }

    .stat-label {
      font-size: 1.1rem;
      color: white;
      opacity: 0.8;
      margin: 0;
    }

    @media (max-width: 768px) {
      .hero-title {
        font-size: 2.5rem;
      }
      
      .hero-subtitle {
        font-size: 1.1rem;
      }
      
      .hero-actions {
        flex-direction: column;
        align-items: center;
      }
      
      .features-grid {
        grid-template-columns: 1fr;
      }
      
      .stats-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 1rem;
      }
      
      .stat-number {
        font-size: 2rem;
      }
    }
  `]
})
export class HomeComponent {
  constructor(public authService: AuthService) {}
}