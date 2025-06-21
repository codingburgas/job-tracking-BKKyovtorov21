export interface JobApplication {
  id: number;
  jobId: number;
  userId: number;
  status: ApplicationStatus;
  submissionDate: Date;
  jobTitle?: string;
  company?: string;
  applicantName?: string;
}

export enum ApplicationStatus {
  SUBMITTED = 'SUBMITTED',
  APPROVED_FOR_INTERVIEW = 'APPROVED_FOR_INTERVIEW',
  REJECTED = 'REJECTED'
}

export interface CreateApplicationRequest {
  jobId: number;
}

export interface UpdateApplicationRequest {
  id: number;
  status: ApplicationStatus;
}