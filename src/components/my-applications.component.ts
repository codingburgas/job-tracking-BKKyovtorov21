import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApplicationService } from '../services/application.service';
import { AuthService } from '../services/auth.service';
import { JobApplication, ApplicationStatus } from '../models/application.model';

@Component({
  selector: 'app-my-applications',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="applications-container">
      <div class="container">
        <div class="applications-header">
          <h1>My Job Applications</h1>
          <p>Track the status of your submitted job applications</p>
        </div>

        <div class="applications-list" *ngIf="applications.length > 0">
          <div class="application-card card" *ngFor="let application of applications">
            <div class="card-header">
              <div class="application-info">
                <h3>{{ application.jobTitle || 'Job Title' }}</h3>
                <p class="company-name">{{ application.company || 'Company Name' }}</p>
              </div>
              <span class="badge" [class]="getStatusBadgeClass(application.status)">
                {{ getStatusText(application.status) }}
              </span>
            </div>
            
            <div class="card-body">
              <div class="application-meta">
                <div class="meta-item">
                  <strong>Applied:</strong> {{ application.submissionDate | date:'mediumDate' }}
                </div>
                <div class="meta-item">
                  <strong>Application ID:</strong> #{{ application.id }}
                </div>
              </div>
              
              <div class="status-description">
                <p>{{ getStatusDescription(application.status) }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="empty-state" *ngIf="applications.length === 0 && !isLoading">
          <div class="empty-icon">📄</div>
          <h3>No Applications Yet</h3>
          <p>You haven't submitted any job applications. Start by browsing available jobs!</p>
          <a href="/jobs" class="btn btn-primary">Browse Jobs</a>
        </div>

        <div class="loading-state" *ngIf="isLoading">
          <div class="spinner"></div>
          <p>Loading your applications...</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .applications-container {
      min-height: 100vh;
      padding: 2rem 0;
      background-color: var(--background-color);
    }

    .applications-header {
      text-align: center;
      margin-bottom: 3rem;
    }

    .applications-header h1 {
      color: var(--primary-color);
      margin-bottom: 1rem;
    }

    .applications-header p {
      font-size: 1.1rem;
      max-width: 600px;
      margin: 0 auto;
    }

    .applications-list {
      max-width: 800px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .application-card {
      transition: all 0.3s ease;
    }

    .application-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }

    .application-info h3 {
      color: var(--primary-color);
      margin: 0 0 0.5rem 0;
    }

    .company-name {
      color: var(--secondary-color);
      font-weight: 500;
      margin: 0;
    }

    .application-meta {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      margin-bottom: 1rem;
      padding: 1rem 0;
      border-top: 1px solid var(--border-color);
    }

    .meta-item {
      color: var(--text-secondary);
      font-size: 0.9rem;
    }

    .meta-item strong {
      color: var(--text-primary);
    }

    .status-description {
      background-color: #f8f9fa;
      padding: 1rem;
      border-radius: 6px;
      border-left: 4px solid var(--primary-color);
    }

    .status-description p {
      margin: 0;
      font-style: italic;
      color: var(--text-secondary);
    }

    .badge-submitted {
      background-color: #e3f2fd;
      color: var(--primary-color);
    }

    .badge-approved {
      background-color: #e8f5e8;
      color: var(--success-color);
    }

    .badge-rejected {
      background-color: #ffebee;
      color: var(--error-color);
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

    @media (max-width: 768px) {
      .card-header {
        flex-direction: column;
        gap: 1rem;
      }

      .application-meta {
        grid-template-columns: 1fr;
        gap: 0.5rem;
      }
    }
  `]
})
export class MyApplicationsComponent implements OnInit {
  applications: JobApplication[] = [];
  isLoading = true;

  constructor(
    private applicationService: ApplicationService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadApplications();
  }

  loadApplications(): void {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.applicationService.getUserApplications(currentUser.id!).subscribe({
        next: (applications) => {
          this.applications = applications;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading applications:', error);
          this.isLoading = false;
        }
      });
    } else {
      this.isLoading = false;
    }
  }

  getStatusBadgeClass(status: ApplicationStatus): string {
    switch (status) {
      case ApplicationStatus.SUBMITTED:
        return 'badge-submitted';
      case ApplicationStatus.APPROVED_FOR_INTERVIEW:
        return 'badge-approved';
      case ApplicationStatus.REJECTED:
        return 'badge-rejected';
      default:
        return 'badge-info';
    }
  }

  getStatusText(status: ApplicationStatus): string {
    switch (status) {
      case ApplicationStatus.SUBMITTED:
        return 'Submitted';
      case ApplicationStatus.APPROVED_FOR_INTERVIEW:
        return 'Interview Approved';
      case ApplicationStatus.REJECTED:
        return 'Rejected';
      default:
        return status;
    }
  }

  getStatusDescription(status: ApplicationStatus): string {
    switch (status) {
      case ApplicationStatus.SUBMITTED:
        return 'Your application has been received and is being reviewed by the hiring team.';
      case ApplicationStatus.APPROVED_FOR_INTERVIEW:
        return 'Congratulations! Your application has been approved. You should expect to hear from the company soon regarding interview details.';
      case ApplicationStatus.REJECTED:
        return 'Unfortunately, your application was not selected for this position. Keep applying to other opportunities!';
      default:
        return 'Application status is being processed.';
    }
  }
}