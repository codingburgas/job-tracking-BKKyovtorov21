import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, of, throwError } from 'rxjs';
import { JobApplication, ApplicationStatus, CreateApplicationRequest, UpdateApplicationRequest } from '../models/application.model';
import { AuthService } from './auth.service';
import { JobService } from './job.service';

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {
  private applicationsSubject = new BehaviorSubject<JobApplication[]>([]);
  public applications$ = this.applicationsSubject.asObservable();

  private applications: JobApplication[] = [];
  private nextApplicationId = 1;

  constructor(
    private authService: AuthService,
    private jobService: JobService
  ) {
    this.applicationsSubject.next(this.applications);
  }

  createApplication(request: CreateApplicationRequest): Observable<JobApplication> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      return throwError(() => new Error('User not authenticated'));
    }

    // Check if user already applied for this job
    const existingApplication = this.applications.find(
      app => app.jobId === request.jobId && app.userId === currentUser.id
    );

    if (existingApplication) {
      return throwError(() => new Error('You have already applied for this job'));
    }

    const newApplication: JobApplication = {
      id: this.nextApplicationId++,
      jobId: request.jobId,
      userId: currentUser.id!,
      status: ApplicationStatus.SUBMITTED,
      submissionDate: new Date()
    };

    this.applications.push(newApplication);
    this.applicationsSubject.next([...this.applications]);

    return of(newApplication);
  }

  getUserApplications(userId: number): Observable<JobApplication[]> {
    return new Observable(observer => {
      const userApplications = this.applications.filter(app => app.userId === userId);
      
      // Enhance applications with job details
      const enhancedApplications = userApplications.map(app => {
        this.jobService.getJobById(app.jobId).subscribe(job => {
          if (job) {
            app.jobTitle = job.title;
            app.company = job.company;
          }
        });
        return app;
      });

      observer.next(enhancedApplications);
      observer.complete();
    });
  }

  getAllApplications(): Observable<JobApplication[]> {
    return new Observable(observer => {
      const enhancedApplications = this.applications.map(app => {
        this.jobService.getJobById(app.jobId).subscribe(job => {
          if (job) {
            app.jobTitle = job.title;
            app.company = job.company;
          }
        });
        // This would normally get user details too, but we'll keep it simple
        return app;
      });

      observer.next(enhancedApplications);
      observer.complete();
    });
  }

  getApplicationsByJobId(jobId: number): Observable<JobApplication[]> {
    const jobApplications = this.applications.filter(app => app.jobId === jobId);
    return of(jobApplications);
  }

  updateApplicationStatus(request: UpdateApplicationRequest): Observable<JobApplication> {
    const index = this.applications.findIndex(app => app.id === request.id);
    
    if (index === -1) {
      return throwError(() => new Error('Application not found'));
    }

    this.applications[index].status = request.status;
    this.applicationsSubject.next([...this.applications]);

    return of(this.applications[index]);
  }

  hasUserApplied(jobId: number, userId: number): boolean {
    return this.applications.some(app => app.jobId === jobId && app.userId === userId);
  }
}