import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { JobService } from '../../services/job.service';
import { JobListing, JobStatus, CreateJobRequest, UpdateJobRequest } from '../../models/job.model';

@Component({
  selector: 'app-admin-jobs',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="admin-jobs-container">
      <div class="container">
        <div class="admin-header">
          <h1>Job Management</h1>
          <p>Create, edit, and manage job listings</p>
          <button class="btn btn-primary" (click)="showCreateForm()">
            Create New Job
          </button>
        </div>

        <!-- Create/Edit Job Form -->
        <div class="job-form card" *ngIf="showForm">
          <div class="card-header">
            <h3>{{ isEditing ? 'Edit Job' : 'Create New Job' }}</h3>
          </div>
          
          <div class="card-body">
            <form (ngSubmit)="onSubmit()" #jobForm="ngForm">
              <div class="form-group">
                <label class="form-label" for="title">Job Title</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  class="form-control"
                  [(ngModel)]="jobFormData.title"
                  required
                  #title="ngModel"
                  [class.error]="title.invalid && title.touched"
                />
                <div class="error-message" *ngIf="title.invalid && title.touched">
                  Job title is required
                </div>
              </div>

              <div class="form-group">
                <label class="form-label" for="company">Company</label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  class="form-control"
                  [(ngModel)]="jobFormData.company"
                  required
                  #company="ngModel"
                  [class.error]="company.invalid && company.touched"
                />
                <div class="error-message" *ngIf="company.invalid && company.touched">
                  Company name is required
                </div>
              </div>

              <div class="form-group">
                <label class="form-label" for="description">Job Description</label>
                <textarea
                  id="description"
                  name="description"
                  class="form-control"
                  rows="6"
                  [(ngModel)]="jobFormData.description"
                  required
                  #description="ngModel"
                  [class.error]="description.invalid && description.touched"
                ></textarea>
                <div class="error-message" *ngIf="description.invalid && description.touched">
                  Job description is required
                </div>
              </div>

              <div class="form-group" *ngIf="isEditing">
                <label class="form-label" for="status">Status</label>
                <select
                  id="status"
                  name="status"
                  class="form-control"
                  [(ngModel)]="jobFormData.status"
                  required
                >
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                </select>
              </div>

              <div class="form-actions">
                <button type="submit" class="btn btn-primary" [disabled]="jobForm.invalid || isSubmitting">
                  <span *ngIf="isSubmitting" class="spinner"></span>
                  {{ isEditing ? 'Update Job' : 'Create Job' }}
                </button>
                <button type="button" class="btn btn-outline ml-2" (click)="cancelForm()">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- Jobs List -->
        <div class="jobs-list" *ngIf="jobs.length > 0">
          <div class="jobs-grid">
            <div class="job-card card" *ngFor="let job of jobs">
              <div class="card-header">
                <div class="job-info">
                  <h3>{{ job.title }}</h3>
                  <p class="company">{{ job.company }}</p>
                </div>
                <span class="badge" [class]="job.status === 'ACTIVE' ? 'badge-success' : 'badge-warning'">
                  {{ job.status }}
                </span>
              </div>
              
              <div class="card-body">
                <p class="job-description">{{ job.description | slice:0:150 }}{{ job.description.length > 150 ? '...' : '' }}</p>
                <div class="job-meta">
                  <small>Posted: {{ job.postingDate | date:'mediumDate' }}</small>
                </div>
              </div>
              
              <div class="card-footer">
                <button class="btn btn-outline btn-small" (click)="editJob(job)">
                  Edit
                </button>
                <button class="btn btn-danger btn-small ml-1" (click)="deleteJob(job.id)">
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="empty-state" *ngIf="jobs.length === 0 && !isLoading">
          <div class="empty-icon">📋</div>
          <h3>No Jobs Created</h3>
          <p>Start by creating your first job listing!</p>
        </div>

        <div class="loading-state" *ngIf="isLoading">
          <div class="spinner"></div>
          <p>Loading jobs...</p>
        </div>

        <div class="alert" *ngIf="alertMessage" [class]="'alert-' + alertType">
          {{ alertMessage }}
        </div>
      </div>
    </div>
  `,
  styles: [`
    .admin-jobs-container {
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
      margin-bottom: 2rem;
    }

    .job-form {
      max-width: 600px;
      margin: 0 auto 3rem;
    }

    .form-actions {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
    }

    .jobs-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 2rem;
    }

    .job-card {
      transition: all 0.3s ease;
    }

    .job-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }

    .job-info h3 {
      color: var(--primary-color);
      margin: 0 0 0.5rem 0;
    }

    .company {
      color: var(--secondary-color);
      font-weight: 500;
      margin: 0;
    }

    .job-description {
      line-height: 1.6;
      margin-bottom: 1rem;
    }

    .job-meta {
      color: var(--text-secondary);
      border-top: 1px solid var(--border-color);
      padding-top: 1rem;
    }

    .card-footer {
      display: flex;
      gap: 0.5rem;
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

    @media (max-width: 768px) {
      .jobs-grid {
        grid-template-columns: 1fr;
      }

      .form-actions {
        flex-direction: column;
      }

      .card-header {
        flex-direction: column;
        gap: 1rem;
      }
    }
  `]
})
export class AdminJobsComponent implements OnInit {
  jobs: JobListing[] = [];
  showForm = false;
  isEditing = false;
  isLoading = true;
  isSubmitting = false;
  alertMessage = '';
  alertType = '';

  jobFormData: any = {
    title: '',
    company: '',
    description: '',
    status: JobStatus.ACTIVE
  };

  constructor(private jobService: JobService) {}

  ngOnInit(): void {
    this.loadJobs();
  }

  loadJobs(): void {
    this.jobService.getAllJobs().subscribe({
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

  showCreateForm(): void {
    this.isEditing = false;
    this.jobFormData = {
      title: '',
      company: '',
      description: '',
      status: JobStatus.ACTIVE
    };
    this.showForm = true;
  }

  editJob(job: JobListing): void {
    this.isEditing = true;
    this.jobFormData = { ...job };
    this.showForm = true;
  }

  cancelForm(): void {
    this.showForm = false;
    this.isEditing = false;
    this.jobFormData = {
      title: '',
      company: '',
      description: '',
      status: JobStatus.ACTIVE
    };
  }

  onSubmit(): void {
    if (this.isSubmitting) return;

    this.isSubmitting = true;

    if (this.isEditing) {
      const updateRequest: UpdateJobRequest = {
        id: this.jobFormData.id,
        title: this.jobFormData.title,
        company: this.jobFormData.company,
        description: this.jobFormData.description,
        status: this.jobFormData.status
      };

      this.jobService.updateJob(updateRequest).subscribe({
        next: () => {
          this.isSubmitting = false;
          this.showAlert('Job updated successfully!', 'success');
          this.cancelForm();
          this.loadJobs();
        },
        error: (error) => {
          this.isSubmitting = false;
          this.showAlert(error.message, 'error');
        }
      });
    } else {
      const createRequest: CreateJobRequest = {
        title: this.jobFormData.title,
        company: this.jobFormData.company,
        description: this.jobFormData.description
      };

      this.jobService.createJob(createRequest).subscribe({
        next: () => {
          this.isSubmitting = false;
          this.showAlert('Job created successfully!', 'success');
          this.cancelForm();
          this.loadJobs();
        },
        error: (error) => {
          this.isSubmitting = false;
          this.showAlert(error.message, 'error');
        }
      });
    }
  }

  deleteJob(jobId: number): void {
    if (confirm('Are you sure you want to delete this job? This action cannot be undone.')) {
      this.jobService.deleteJob(jobId).subscribe({
        next: () => {
          this.showAlert('Job deleted successfully!', 'success');
          this.loadJobs();
        },
        error: (error) => {
          this.showAlert(error.message, 'error');
        }
      });
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