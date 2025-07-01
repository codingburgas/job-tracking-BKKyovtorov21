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
  templateUrl: './job-list.component.html',
  styleUrls: ['./job-list.component.css']
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