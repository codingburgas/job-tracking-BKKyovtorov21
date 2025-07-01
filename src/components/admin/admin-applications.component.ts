import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApplicationService } from '../../services/application.service';
import { JobApplication, ApplicationStatus, UpdateApplicationRequest } from '../../models/application.model';

@Component({
  selector: 'app-admin-applications',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-applications.component.html',
  styleUrls: ['./admin-applications.component.css']
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