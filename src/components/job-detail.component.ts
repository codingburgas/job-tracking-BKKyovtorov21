import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { JobService } from '../services/job.service';
import { ApplicationService } from '../services/application.service';
import { AuthService } from '../services/auth.service';
import { JobListing } from '../models/job.model';

@Component({
  selector: 'app-job-detail',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="job-detail-container">
      <div class="container">
        <div class="back-button">
          <button class="btn btn-outline" (click)="goBack()">
            ← Back to Jobs
          </button>
        </div>

        <div class="job-detail-card card" *ngIf="job">
          <div class="card-header">
            <div class="job-header-content">
              <h1>{{ job.title }}</h1>
              <span class="badge badge-success">{{ job.status }}</span>
            </div>
            <div class="company-info">
              <h2>{{ job.company }}</h2>
              <p class="posting-date">Posted: {{ job.postingDate | date:'fullDate' }}</p>
            </div>
          </div>
          
          <div class="card-body">
            <div class="job-description">
              <h3>Job Description</h3>
              <p>{{ job.description }}</p>
            </div>
          </div>
          
          <div class="card-footer">
            <button 
              class="btn btn-primary btn-large"
              (click)="applyToJob()"
              [disabled]="hasApplied || isApplying"
              *ngIf="authService.isUser()"
            >
              <span *ngIf="!hasApplied && !isApplying">Apply for this Position</span>
              <span *ngIf="hasApplied">Already Applied</span>
              <span *ngIf="isApplying">Submitting Application...</span>
            </button>
            
            <div class="application-status" *ngIf="hasApplied">
              <div class="status-info">
                <span class="badge badge-info">Application Submitted</span>
                <p>Your application has been received. You will be notified of any updates.</p>
              </div>
            </div>
          </div>
        </div>

        <div class="loading-state" *ngIf="!job && isLoading">
          <div class="spinner"></div>
          <p>Loading job details...</p>
        </div>

        <div class="error-state" *ngIf="!job && !isLoading">
          <div class="error-icon">❌</div>
          <h3>Job Not Found</h3>
          <p>The job you're looking for doesn't exist or has been removed.</p>
          <button class="btn btn-primary" (click)="goBack()">Back to Jobs</button>
        </div>

        <div class="alert" *ngIf="alertMessage" [class]="'alert-' + alertType">
          {{ alertMessage }}
        </div>
      </div>
    </div>
  `,
  styles: [`
    .job-detail-container {
      min-height: 100vh;
      padding: 2rem 0;
      background-color: var(--background-color);
    }

    .back-button {
      margin-bottom: 2rem;
    }

    .job-detail-card {
      max-width: 800px;
      margin: 0 auto;
    }

    .job-header-content {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 1rem;
    }

    .job-header-content h1 {
      color: var(--primary-color);
      margin: 0;
      flex: 1;
    }

    .company-info h2 {
      color: var(--secondary-color);
      margin: 0 0 0.5rem 0;
    }

    .posting-date {
      color: var(--text-secondary);
      margin: 0;
    }

    .job-description {
      margin-bottom: 2rem;
    }

    .job-description h3 {
      color: var(--text-primary);
      margin-bottom: 1rem;
      padding-bottom: 0.5rem;
      border-bottom: 2px solid var(--primary-color);
    }

    .job-description p {
      line-height: 1.8;
      font-size: 1.1rem;
    }

    .card-footer {
      text-align: center;
    }

    .application-status {
      margin-top: 2rem;
      padding: 1.5rem;
      background-color: #f8f9fa;
      border-radius: 8px;
      border-left: 4px solid var(--primary-color);
    }

    .status-info p {
      margin: 0.5rem 0 0 0;
      color: var(--text-secondary);
    }

    .loading-state,
    .error-state {
      text-align: center;
      padding: 4rem 2rem;
    }

    .error-icon {
      font-size: 4rem;
      margin-bottom: 1rem;
    }

    .error-state h3 {
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
      .job-header-content {
        flex-direction: column;
        gap: 1rem;
      }

      .job-header-content h1 {
        font-size: 1.75rem;
      }

      .company-info h2 {
        font-size: 1.5rem;
      }
    }
  `]
})
export class JobDetailComponent implements OnInit {
  job: JobListing | null = null;
  isLoading = true;
  isApplying = false;
  hasApplied = false;
  alertMessage = '';
  alertType = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private jobService: JobService,
    private applicationService: ApplicationService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    const jobId = Number(this.route.snapshot.paramMap.get('id'));
    if (jobId) {
      this.loadJob(jobId);
      this.checkApplicationStatus(jobId);
    } else {
      this.isLoading = false;
    }
  }

  loadJob(jobId: number): void {
    this.jobService.getJobById(jobId).subscribe({
      next: (job) => {
        this.job = job || null;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading job:', error);
        this.isLoading = false;
      }
    });
  }

  checkApplicationStatus(jobId: number): void {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.hasApplied = this.applicationService.hasUserApplied(jobId, currentUser.id!);
    }
  }

  applyToJob(): void {
    if (!this.job || this.isApplying || this.hasApplied) return;

    this.isApplying = true;
    this.applicationService.createApplication({ jobId: this.job.id }).subscribe({
      next: () => {
        this.isApplying = false;
        this.hasApplied = true;
        this.showAlert('Application submitted successfully!', 'success');
      },
      error: (error) => {
        this.isApplying = false;
        this.showAlert(error.message, 'error');
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/jobs']);
  }

  showAlert(message: string, type: string): void {
    this.alertMessage = message;
    this.alertType = type;
    setTimeout(() => {
      this.alertMessage = '';
    }, 5000);
  }
}