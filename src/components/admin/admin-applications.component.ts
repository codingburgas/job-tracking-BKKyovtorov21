import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApplicationService } from '../../services/application.service';
import { JobApplication, ApplicationStatus, UpdateApplicationRequest } from '../../models/application.model';

@Component({
  selector: 'app-admin-applications',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="admin-applications-container">
      <div class="container">
        <div class="admin-header">
          <h1>Application Management</h1>
          <p>Review and manage job applications from candidates</p>
        </div>

        <div class="applications-list" *ngIf="applications.length > 0">
          <div class="application-card card" *ngFor="let application of applications">
            <div class="card-header">
              <div class="application-info">
                <h3>{{ application.jobTitle || 'Job Title' }}</h3>
                <p class="company-name">{{ application.company || 'Company Name' }}</p>
                <p class="applicant-info">Application #{{ application.id }} • User ID: {{ application.userId }}</p>
              </div>
              <span class="badge" [class]="getStatusBadgeClass(application.status)">
                {{ getStatusText(application.status) }}
              </span>
            </div>
            
            <div class="card-body">
              <div class="application-meta">
                <div class="meta-item">
                  <strong>Submitted:</strong> {{ application.submissionDate | date:'mediumDate' }}
                </div>
                <div class="meta-item">
                  <strong>Job ID:</strong> {{ application.jobId }}
                </div>
              </div>
            </div>
            
            <div class="card-footer">
              <div class="status-actions">
                <label class="form-label">Update Status:</label>
                <div class="status-buttons">
                  <button 
                    class="btn btn-primary btn-small"
                    [class.active]="application.status === ApplicationStatus.SUBMITTED"
                    (click)="updateStatus(application.id, ApplicationStatus.SUBMITTED)"
                    [disabled]="isUpdating"
                  >
                    Submitted
                  </button>
                  <button 
                    class="btn btn-accent btn-small"
                    [class.active]="application.status === ApplicationStatus.APPROVED_FOR_INTERVIEW"
                    (click)="updateStatus(application.id, ApplicationStatus.APPROVED_FOR_INTERVIEW)"
                    [disabled]="isUpdating"
                  >
                    Approve for Interview
                  </button>
                  <button 
                    class="btn btn-danger btn-small"
                    [class.active]="application.status === ApplicationStatus.REJECTED"
                    (click)="updateStatus(application.id, ApplicationStatus.REJECTED)"
                    [disabled]="isUpdating"
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="empty-state" *ngIf="applications.length === 0 && !isLoading">
          <div class="empty-icon">📄</div>
          <h3>No Applications Received</h3>
          <p>Applications will appear here once candidates start applying to your job listings.</p>
        </div>

        <div class="loading-state" *ngIf="isLoading">
          <div class="spinner"></div>
          <p>Loading applications...</p>
        </div>

        <div class="alert" *ngIf="alertMessage" [class]="'alert-' + alertType">
          {{ alertMessage }}
        </div>
      </div>
    </div>
  `,
  styles: [`
    .admin-applications-container {
      min-height: 100vh;
      padding: 2rem 0;
      background-color: var(--background-color);
    }

    .admin-header {
      text-align: center;
      margin-bottom: 3rem;
    }

    .admin-header h1 {
      color: var(--primary-color);
      margin-bottom: 1rem;
    }

    .admin-header p {
      font-size: 1.1rem;
      max-width: 600px;
      margin: 0 auto;
    }

    .applications-list {
      max-width: 900px;
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
      margin: 0 0 0.5rem 0;
    }

    .applicant-info {
      color: var(--text-secondary);
      font-size: 0.9rem;
      margin: 0;
    }

    .application-meta {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      margin-bottom: 1rem;
      padding: 1rem 0;
      border-top: 1px solid var(--border-color);
      border-bottom: 1px solid var(--border-color);
    }

    .meta-item {
      color: var(--text-secondary);
      font-size: 0.9rem;
    }

    .meta-item strong {
      color: var(--text-primary);
    }

    .status-actions {
      width: 100%;
    }

    .status-actions .form-label {
      margin-bottom: 0.5rem;
      font-weight: 600;
      color: var(--text-primary);
    }

    .status-buttons {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
    }

    .status-buttons button.active {
      opacity: 0.7;
      cursor: not-allowed;
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
      .card-header {
        flex-direction: column;
        gap: 1rem;
      }

      .application-meta {
        grid-template-columns: 1fr;
        gap: 0.5rem;
      }

      .status-buttons {
        flex-direction: column;
      }

      .status-buttons button {
        width: 100%;
      }
    }
  `]
})
export class AdminApplicationsComponent implements OnInit {
  applications: JobApplication[] = [];
  isLoading = true;
  isUpdating = false;
  alertMessage = '';
  alertType = '';

  // Expose ApplicationStatus enum to template
  public ApplicationStatus = ApplicationStatus;

  constructor(private applicationService: ApplicationService) {}

  ngOnInit(): void {
    this.loadApplications();
  }

  loadApplications(): void {
    this.applicationService.getAllApplications().subscribe({
      next: (applications) => {
        this.applications = applications;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading applications:', error);
        this.isLoading = false;
        this.showAlert('Error loading applications. Please try again.', 'error');
      }
    });
  }

  updateStatus(applicationId: number, status: ApplicationStatus): void {
    if (this.isUpdating) return;

    this.isUpdating = true;
    const updateRequest: UpdateApplicationRequest = {
      id: applicationId,
      status: status
    };

    this.applicationService.updateApplicationStatus(updateRequest).subscribe({
      next: () => {
        this.isUpdating = false;
        this.showAlert('Application status updated successfully!', 'success');
        // Update the local application status
        const application = this.applications.find(app => app.id === applicationId);
        if (application) {
          application.status = status;
        }
      },
      error: (error) => {
        this.isUpdating = false;
        this.showAlert(error.message, 'error');
      }
    });
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

  showAlert(message: string, type: string): void {
    this.alertMessage = message;
    this.alertType = type;
    setTimeout(() => {
      this.alertMessage = '';
    }, 5000);
  }
}