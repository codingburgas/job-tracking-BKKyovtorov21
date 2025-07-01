import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApplicationService } from '../services/application.service';
import { AuthService } from '../services/auth.service';
import { JobApplication, ApplicationStatus } from '../models/application.model';

@Component({
  selector: 'app-my-applications',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-applications.component.html',
  styleUrls: ['./my-applications.component.css']
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