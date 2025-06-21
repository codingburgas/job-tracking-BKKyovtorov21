import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, of, throwError } from 'rxjs';
import { JobListing, JobStatus, CreateJobRequest, UpdateJobRequest } from '../models/job.model';

@Injectable({
  providedIn: 'root'
})
export class JobService {
  private jobsSubject = new BehaviorSubject<JobListing[]>([]);
  public jobs$ = this.jobsSubject.asObservable();

  private jobs: JobListing[] = [
    {
      id: 1,
      title: 'Full Stack Developer',
      company: 'TechCorp Solutions',
      description: 'We are looking for a skilled Full Stack Developer to join our dynamic team. The ideal candidate should have experience with modern web technologies including Angular, Node.js, and database management. You will be responsible for developing user-facing web applications and ensuring they are optimized for maximum speed and scalability.',
      postingDate: new Date('2024-12-15'),
      status: JobStatus.ACTIVE
    },
    {
      id: 2,
      title: 'UI/UX Designer',
      company: 'Creative Digital Agency',
      description: 'Join our creative team as a UI/UX Designer where you will create engaging and intuitive user experiences. We are seeking someone passionate about user-centered design principles, proficient in design tools like Figma and Adobe Creative Suite, and experienced in creating wireframes, prototypes, and high-fidelity mockups.',
      postingDate: new Date('2024-12-10'),
      status: JobStatus.ACTIVE
    },
    {
      id: 3,
      title: 'Project Manager',
      company: 'Global Enterprises Inc',
      description: 'We are seeking an experienced Project Manager to oversee multiple software development projects. The successful candidate will have excellent communication skills, experience with Agile methodologies, and the ability to coordinate cross-functional teams to deliver projects on time and within budget.',
      postingDate: new Date('2024-12-05'),
      status: JobStatus.INACTIVE
    }
  ];

  private nextJobId = 4;

  constructor() {
    this.jobsSubject.next(this.jobs);
  }

  getAllJobs(): Observable<JobListing[]> {
    return of([...this.jobs]);
  }

  getActiveJobs(): Observable<JobListing[]> {
    const activeJobs = this.jobs.filter(job => job.status === JobStatus.ACTIVE);
    return of(activeJobs);
  }

  getJobById(id: number): Observable<JobListing | undefined> {
    const job = this.jobs.find(j => j.id === id);
    return of(job);
  }

  createJob(jobRequest: CreateJobRequest): Observable<JobListing> {
    const newJob: JobListing = {
      id: this.nextJobId++,
      ...jobRequest,
      postingDate: new Date(),
      status: JobStatus.ACTIVE
    };

    this.jobs.push(newJob);
    this.jobsSubject.next([...this.jobs]);
    
    return of(newJob);
  }

  updateJob(jobRequest: UpdateJobRequest): Observable<JobListing> {
    const index = this.jobs.findIndex(j => j.id === jobRequest.id);
    
    if (index === -1) {
      return throwError(() => new Error('Job not found'));
    }

    this.jobs[index] = {
      ...this.jobs[index],
      ...jobRequest
    };

    this.jobsSubject.next([...this.jobs]);
    return of(this.jobs[index]);
  }

  deleteJob(id: number): Observable<boolean> {
    const index = this.jobs.findIndex(j => j.id === id);
    
    if (index === -1) {
      return throwError(() => new Error('Job not found'));
    }

    this.jobs.splice(index, 1);
    this.jobsSubject.next([...this.jobs]);
    
    return of(true);
  }
}