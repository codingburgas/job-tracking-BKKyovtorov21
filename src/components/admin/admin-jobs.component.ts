import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { JobService } from '../../services/job.service';
import { JobListing, JobStatus, CreateJobRequest, UpdateJobRequest } from '../../models/job.model';

@Component({
  selector: 'app-admin-jobs',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-jobs.component.html',
  styleUrls: ['./admin-jobs.component.css']
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