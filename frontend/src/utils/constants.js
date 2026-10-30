export const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const USER_ROLES = {
  STUDENT: 'student',
  TPO: 'tpo',
};

export const APPLICATION_STATUS = {
  APPLIED: 'Applied',
  SHORTLISTED: 'Shortlisted',
  INTERVIEW_SCHEDULED: 'Interview Scheduled',
  SELECTED: 'Selected',
  REJECTED: 'Rejected',
  WITHDRAWN: 'Withdrawn',
};

export const DOCUMENT_STATUS = {
  PENDING: 'Pending',
  VERIFIED: 'Verified',
  REJECTED: 'Rejected',
};

export const DRIVE_STATUS = {
  OPEN: 'Open',
  CLOSING_SOON: 'Closing Soon',
  CLOSED: 'Closed',
  DRAFT: 'Draft',
};
