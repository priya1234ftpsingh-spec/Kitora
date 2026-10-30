import Student from '../models/Student.js';
import Company from '../models/Company.js';
import PlacementDrive from '../models/PlacementDrive.js';
import Application from '../models/Application.js';
import Interview from '../models/Interview.js';
import Document from '../models/Document.js';
import Training from '../models/Training.js';

export const getTpoDashboardAnalytics = async () => {
  const [
    totalStudents,
    placedStudents,
    totalCompanies,
    activeDrives,
    totalApplications,
    pendingDocs,
    upcomingInterviews,
    trainingsCount,
  ] = await Promise.all([
    Student.countDocuments(),
    Student.countDocuments({ placementStatus: 'Placed' }),
    Company.countDocuments({ isActive: true }),
    PlacementDrive.countDocuments({ status: { $in: ['Open', 'Closing Soon'] } }),
    Application.countDocuments(),
    Document.countDocuments({ status: 'Pending' }),
    Interview.countDocuments({ status: 'Scheduled' }),
    Training.countDocuments(),
  ]);

  // Application status breakdown
  const statusCounts = await Application.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
      },
    },
  ]);

  const applicationStats = {
    Applied: 0,
    Shortlisted: 0,
    'Interview Scheduled': 0,
    Selected: 0,
    Rejected: 0,
  };
  statusCounts.forEach((item) => {
    if (applicationStats.hasOwnProperty(item._id)) {
      applicationStats[item._id] = item.count;
    }
  });

  // Branch-wise placement
  const branchStats = await Student.aggregate([
    {
      $group: {
        _id: '$branch',
        total: { $sum: 1 },
        placed: {
          $sum: {
            $cond: [{ $eq: ['$placementStatus', 'Placed'] }, 1, 0],
          },
        },
      },
    },
    {
      $project: {
        branch: '$_id',
        total: 1,
        placed: 1,
        unplaced: { $subtract: ['$total', '$placed'] },
      },
    },
  ]);

  // Package distribution for placed students
  const packageDistribution = await Student.aggregate([
    { $match: { placementStatus: 'Placed', placedPackage: { $gt: 0 } } },
    {
      $bucket: {
        groupBy: '$placedPackage',
        boundaries: [0, 4, 7, 10, 20, 50],
        default: 'Other',
        output: {
          count: { $sum: 1 },
        },
      },
    },
  ]);

  // Format package ranges
  const packageRanges = [
    { range: '< 4 LPA', count: 0 },
    { range: '4 - 7 LPA', count: 0 },
    { range: '7 - 10 LPA', count: 0 },
    { range: '10 - 20 LPA', count: 0 },
    { range: '> 20 LPA', count: 0 },
  ];

  packageDistribution.forEach((b) => {
    if (b._id === 0) packageRanges[0].count = b.count;
    else if (b._id === 4) packageRanges[1].count = b.count;
    else if (b._id === 7) packageRanges[2].count = b.count;
    else if (b._id === 10) packageRanges[3].count = b.count;
    else if (b._id === 20) packageRanges[4].count = b.count;
  });

  // Company-wise selections
  const companySelections = await Application.aggregate([
    { $match: { status: 'Selected' } },
    {
      $lookup: {
        from: 'placementdrives',
        localField: 'drive',
        foreignField: '_id',
        as: 'driveData',
      },
    },
    { $unwind: '$driveData' },
    {
      $lookup: {
        from: 'companies',
        localField: 'driveData.company',
        foreignField: '_id',
        as: 'companyData',
      },
    },
    { $unwind: '$companyData' },
    {
      $group: {
        _id: '$companyData.name',
        selectedCount: { $sum: 1 },
      },
    },
    { $sort: { selectedCount: -1 } },
    { $limit: 8 },
  ]);

  const placementRate =
    totalStudents > 0
      ? Math.round((placedStudents / totalStudents) * 100)
      : 0;

  return {
    metrics: {
      totalStudents,
      placedStudents,
      placementRate,
      totalCompanies,
      activeDrives,
      totalApplications,
      shortlistedCount: applicationStats.Shortlisted,
      selectedCount: applicationStats.Selected,
      pendingDocs,
      upcomingInterviews,
      trainingsCount,
    },
    applicationOverview: [
      { name: 'Applied', count: applicationStats.Applied, fill: '#3b82f6' },
      { name: 'Shortlisted', count: applicationStats.Shortlisted, fill: '#8b5cf6' },
      { name: 'Interview', count: applicationStats['Interview Scheduled'], fill: '#f59e0b' },
      { name: 'Selected', count: applicationStats.Selected, fill: '#10b981' },
      { name: 'Rejected', count: applicationStats.Rejected, fill: '#ef4444' },
    ],
    branchStats: branchStats.map((item) => ({
      branch: item.branch || 'BCA General',
      total: item.total,
      placed: item.placed,
      unplaced: item.unplaced,
      rate: item.total > 0 ? Math.round((item.placed / item.total) * 100) : 0,
    })),
    packageDistribution: packageRanges,
    companySelections: companySelections.map((c) => ({
      company: c._id,
      selected: c.selectedCount,
    })),
  };
};
