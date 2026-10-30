import Application from '../models/Application.js';
import PlacementDrive from '../models/PlacementDrive.js';
import Student from '../models/Student.js';
import { checkEligibility } from '../services/eligibilityService.js';
import { notifyStudent, notifyTPO } from '../services/notificationService.js';

// @desc    Apply for a placement drive
// @route   POST /api/applications/apply/:driveId
// @access  Private (Student)
export const applyToDrive = async (req, res, next) => {
  try {
    const student = await Student.findOne({ user: req.user._id }).populate('user');
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student profile not found' });
    }

    const driveId = req.params.driveId || req.body.driveId;
    const drive = await PlacementDrive.findById(driveId).populate('company');
    if (!drive) {
      return res.status(404).json({ success: false, message: 'Placement drive not found' });
    }

    // Check if drive is closed or expired
    if (drive.status === 'Closed' || new Date() > new Date(drive.applicationDeadline)) {
      return res.status(400).json({
        success: false,
        message: 'Applications are closed for this drive as the deadline has passed.',
      });
    }

    // Check duplicate
    const existing = await Application.findOne({ student: student._id, drive: drive._id });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'You have already submitted an application for this drive.',
      });
    }

    // Evaluate eligibility
    const eligibilityResult = checkEligibility(student, drive);
    if (!eligibilityResult.isEligible) {
      return res.status(400).json({
        success: false,
        message: 'Ineligible to apply: ' + eligibilityResult.reasons.join(' | '),
        eligibilityResult,
      });
    }

    // Create Application
    const application = await Application.create({
      student: student._id,
      drive: drive._id,
      status: 'Applied',
      profileSnapshot: {
        rollNumber: student.rollNumber,
        cgpa: student.overallCgpa,
        branch: student.branch,
        course: student.course,
        skills: student.skills?.technical || [],
        resumeUrl: student.resumeUrl || '',
      },
      eligibilityCheck: {
        isEligible: eligibilityResult.isEligible,
        matchScore: eligibilityResult.matchScore,
        reasons: eligibilityResult.reasons,
      },
      currentRound: 'Application Submitted',
    });

    // Notify TPO
    await notifyTPO({
      type: 'Placement',
      title: 'New Application Received',
      message: `${student.user.name} (${student.rollNumber}) applied for ${drive.jobRole} at ${drive.company.name}.`,
      link: `/tpo/applications?driveId=${drive._id}`,
    });

    // Notify Student
    await notifyStudent(student.user._id, {
      type: 'Placement',
      title: 'Application Submitted Successfully',
      message: `Your application for ${drive.jobRole} at ${drive.company.name} has been received and is under review.`,
      link: '/student/applications',
    });

    return res.status(201).json({
      success: true,
      message: 'Application submitted successfully!',
      application,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in student's applications
// @route   GET /api/applications/my
// @access  Private (Student)
export const getMyApplications = async (req, res, next) => {
  try {
    const student = await Student.findOne({ user: req.user._id });
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student profile not found' });
    }

    const applications = await Application.find({ student: student._id })
      .populate({
        path: 'drive',
        populate: { path: 'company', select: 'name logo location website' },
      })
      .sort({ appliedAt: -1 });

    return res.status(200).json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all applications (TPO) with filtering
// @route   GET /api/applications
// @access  Private (TPO)
export const getAllApplications = async (req, res, next) => {
  try {
    const { driveId = '', status = '', search = '' } = req.query;
    const filter = {};

    if (driveId) filter.drive = driveId;
    if (status) filter.status = status;

    let applications = await Application.find(filter)
      .populate({
        path: 'student',
        populate: { path: 'user', select: 'name email avatar' },
      })
      .populate({
        path: 'drive',
        populate: { path: 'company', select: 'name logo' },
      })
      .sort({ appliedAt: -1 });

    if (search.trim()) {
      const s = search.toLowerCase();
      applications = applications.filter((app) => {
        const studentName = app.student?.user?.name?.toLowerCase() || '';
        const roll = app.student?.rollNumber?.toLowerCase() || '';
        const role = app.drive?.jobRole?.toLowerCase() || '';
        const company = app.drive?.company?.name?.toLowerCase() || '';
        return studentName.includes(s) || roll.includes(s) || role.includes(s) || company.includes(s);
      });
    }

    return res.status(200).json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update application status (TPO)
// @route   PUT /api/applications/:id/status
// @access  Private (TPO)
export const updateApplicationStatus = async (req, res, next) => {
  try {
    const { status, feedback, currentRound } = req.body;
    const validStatuses = ['Applied', 'Shortlisted', 'Interview Scheduled', 'Selected', 'Rejected'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
      });
    }

    const application = await Application.findById(req.params.id)
      .populate('student')
      .populate({
        path: 'drive',
        populate: { path: 'company', select: 'name' },
      });

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    application.status = status;
    if (feedback !== undefined) application.feedback = feedback;
    if (currentRound) application.currentRound = currentRound;
    application.reviewedBy = req.user._id;
    application.reviewedAt = new Date();

    await application.save();

    const studentUser = application.student.user;
    const driveName = application.drive.jobRole;
    const companyName = application.drive.company?.name || 'Company';

    // If student is Selected, update student placement status
    if (status === 'Selected') {
      const studentDoc = await Student.findById(application.student._id);
      studentDoc.placementStatus = 'Placed';
      studentDoc.placedCompany = companyName;
      studentDoc.placedPackage = application.drive.package;
      await studentDoc.save();
    }

    // Notify Student of status change
    await notifyStudent(studentUser, {
      type: status === 'Selected' ? 'Result' : 'Placement',
      title: `Application Status Updated: ${companyName}`,
      message: `Your application for ${driveName} at ${companyName} has been updated to: "${status}".${feedback ? ` Feedback: ${feedback}` : ''}`,
      link: '/student/applications',
    });

    return res.status(200).json({
      success: true,
      message: `Application updated to ${status}`,
      application,
    });
  } catch (error) {
    next(error);
  }
};
