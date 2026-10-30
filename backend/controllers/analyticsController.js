import { getTpoDashboardAnalytics } from '../services/analyticsService.js';
import Student from '../models/Student.js';
import PlacementDrive from '../models/PlacementDrive.js';
import Application from '../models/Application.js';

// @desc    Get comprehensive TPO analytics
// @route   GET /api/analytics/dashboard
// @access  Private (TPO)
export const getDashboardAnalytics = async (req, res, next) => {
  try {
    const data = await getTpoDashboardAnalytics();
    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get detailed tabular reports data
// @route   GET /api/analytics/reports
// @access  Private (TPO)
export const getReportsData = async (req, res, next) => {
  try {
    const placedStudents = await Student.find({ placementStatus: 'Placed' })
      .populate('user', 'name email')
      .sort({ placedPackage: -1 });

    const driveSummary = await PlacementDrive.find()
      .populate('company', 'name')
      .sort({ createdAt: -1 });

    const drivesWithStats = await Promise.all(
      driveSummary.map(async (d) => {
        const apps = await Application.countDocuments({ drive: d._id });
        const selected = await Application.countDocuments({ drive: d._id, status: 'Selected' });
        return {
          id: d._id,
          role: d.jobRole,
          company: d.company?.name || 'Partner',
          package: d.package,
          deadline: d.applicationDeadline,
          status: d.status,
          totalApplicants: apps,
          selectedCount: selected,
        };
      })
    );

    return res.status(200).json({
      success: true,
      placedStudents,
      drivesWithStats,
    });
  } catch (error) {
    next(error);
  }
};
