export interface JobListing {
  id: number;
  title: string;
  company: string;
  description: string;
  postingDate: Date;
  status: JobStatus;
}

export enum JobStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE'
}

export interface CreateJobRequest {
  title: string;
  company: string;
  description: string;
}

export interface UpdateJobRequest {
  id: number;
  title: string;
  company: string;
  description: string;
  status: JobStatus;
}