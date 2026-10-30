export const getEligibilityBadge = (isEligible) => {
  return isEligible
    ? { text: 'Eligible to Apply', variant: 'success' }
    : { text: 'Not Eligible', variant: 'danger' };
};

export const getStatusBadgeVariant = (status) => {
  switch (status) {
    case 'Selected':
    case 'Verified':
    case 'Open':
      return 'success';
    case 'Shortlisted':
    case 'Interview Scheduled':
    case 'Closing Soon':
    case 'Ongoing':
      return 'warning';
    case 'Rejected':
    case 'Closed':
    case 'Cancelled':
      return 'danger';
    case 'Applied':
    case 'Pending':
    case 'Upcoming':
      return 'info';
    default:
      return 'neutral';
  }
};
