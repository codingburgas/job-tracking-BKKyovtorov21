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
  templateUrl: './job-detail.component.html',
  styleUrls: ['./job-detail.component.css']
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