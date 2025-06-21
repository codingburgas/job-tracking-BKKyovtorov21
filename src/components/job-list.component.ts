import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { JobService } from '../services/job.service';
import { ApplicationService } from '../services/application.service';
import { AuthService } from '../services/auth.service';
import { JobListing } from '../models/job.model';

@Component({
  selector: 'app-job-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="jobs-container">
      <div class="container">
        <div class="jobs-header">
          <h1>Available Job Opportunities</h1>
          <p>Discover your next career move from our curated list of active job postings</p>
        </div>

        <div class="jobs-grid" *ngIf="jobs.length > 0">
          <div class="job-card card" *ngFor="let job of jobs">
            <div class="card-header">
              <h3>{{ job.title }}</h3>
              <span class="badge badge-success">{{ job.status }}</span>
            </div>
            
            <div class="card-body">
              <div class="company-info">
                <strong>{{ job.company }}</strong>
              </div>
              <p class="job-description">{{ job.description | slice:0:200 }}{{ job.description.length > 200 ? '...' : '' }}</p>
              <div class="job-meta">
                <small>Posted: {{ job.postingDate | date:'mediumDate' }}</small>
              </div>
            </div>
            
            <div class="card-footer">
              <button 
                class="btn btn-primary"
                (click)="viewJob(job.id)"
              >
                View Details
              </button>
              <button 
                class="btn btn-accent ml-2"
                (click)="applyToJob(job.id)"
                [disabled]="hasApplied(job.id) || isApplying"
              >
                <span *ngIf="!hasApplied(job.id) && !isApplying">Apply Now</span>
                <span *ngIf="hasApplied(job.id)">Already Applied</span>
                <span *ngIf="isApplying">Applying...</span>
              </button>
            </div>
          </div>
        </div>

        <div class="empty-state" *ngIf="jobs.length === 0 && !isLoading">
          <div class="empty-icon">📋</div>
          <h3>No Active Jobs Available</h3>
          <p>Check back later for new job opportunities!</p>
        </div>

        <div class="loading-state" *ngIf="isLoading">
          <div class="spinner"></div>
          <p>Loading job opportunities...</p>
        </div>

        <div class="alert" *ngIf="alertMessage" [class]="'alert-' + alertType">
          {{ alertMessage }}
        </div>
      </div>
    </div>
  `,
  styles: [`
    .jobs-container {
      min-height: 100vh;
      padding: 2rem 0;
      background-color: var(--background-color);
    }

    .jobs-header {
      text-align: center;
      margin-bottom: 3rem;
    }

    .jobs-header h1 {
      color: var(--primary-color);
      margin-bottom: 1rem;
    }

    .jobs-header p {
      font-size: 1.1rem;
      max-width: 600px;
      margin: 0 auto;
    }

    .jobs-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
      gap: 2rem;
    }

    .job-card {
      transition: all 0.3s ease;
    }

    .job-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 1rem;
    }

    .card-header h3 {
      color: var(--primary-color);
      margin: 0;
      flex: 1;
    }

    .company-info {
      color: var(--secondary-color);
      font-size: 1.1rem;
      margin-bottom: 1rem;
    }

    .job-description {
      line-height: 1.6;
      margin-bottom: 1rem;
    }

    .job-meta {
      color: var(--text-secondary);
      border-top: 1px solid var(--border-color);
      padding-top: 1rem;
      margin-top: 1rem;
    }

    .card-footer {
      display: flex;
      gap: 1rem;
      align-items: center;
    }

    .empty-state,
    .loading-state {
      text-align: center;
      padding: 4rem 2rem;
    }

    .empty-icon {
      font-size: 4rem;
      margin-bottom: 1rem;
    }

    .empty-state h3 {
      color: var(--text-primary);
      margin-bottom: 1rem;
    }

    .alert {
      padding: 1rem;
      border-radius: 6px;
      margin: 2rem 0;
      text-align: center;
    }

    .alert-success {
      background-color: #d4edda;
      color: #155724;
      border: 1px solid #c3e6cb;
    }

    .alert-error {
      background-color: #f8d7da;
      color: #721c24;
      border: 1px solid #f5c6cb;
    }

    @media (max-width: 768px) {
      .jobs-grid {
        grid-template-columns: 1fr;
        gap: 1.5rem;
      }

      .card-footer {
        flex-direction: column;
        gap: 0.5rem;
      }

      .card-footer button {
        width: 100%;
      }
    }
  `]
})
export class JobListComponent implements OnInit {
  jobs: JobListing[] = [];
  isLoading = true;
  isApplying = false;
  alertMessage = '';
  alertType = '';
  appliedJobs: Set<number> = new Set();

  constructor(
    private jobService: JobService,
    private applicationService: ApplicationService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadJobs();
    this.loadUserApplications();
  }

  loadJobs(): void {
    this.jobService.getActiveJobs().subscribe({
      next: (jobs) => {
        this.jobs = jobs;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading jobs:', error);
        this.isLoading = false;
        this.showAlert('Error loading jobs. Please try again.', 'error');
      }
    });
  }

  loadUserApplications(): void {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.applicationService.getUserApplications(currentUser.id!).subscribe({
        next: (applications) => {
          this.appliedJobs = new Set(applications.map(app => app.jobId));
        }
      });
    }
  }

  viewJob(jobId: number): void {
    this.router.navigate(['/jobs', jobId]);
  }

  applyToJob(jobId: number): void {
    if (this.isApplying) return;

    this.isApplying = true;
    this.applicationService.createApplication({ jobId }).subscribe({
      next: () => {
        this.isApplying = false;
        this.appliedJobs.add(jobId);
        this.showAlert('Application submitted successfully!', 'success');
      },
      error: (error) => {
        this.isApplying = false;
        this.showAlert(error.message, 'error');
      }
    });
  }

  hasApplied(jobId: number): boolean {
    return this.appliedJobs.has(jobId);
  }

  showAlert(message: string, type: string): void {
    this.alertMessage = message;
    this.alertType = type;
    setTimeout(() => {
      this.alertMessage = '';
    }, 5000);
  }
}