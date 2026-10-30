import PlacementDrive from '../models/PlacementDrive.js';
import Company from '../models/Company.js';
import Student from '../models/Student.js';
import Application from '../models/Application.js';
import { checkEligibility } from '../services/eligibilityService.js';
import { calculateDriveMatch } from '../services/aiService.js';
import { notifyAllStudents } from '../services/notificationService.js';

// @desc    Get all placement drives
// @route   GET /api/drives
// @access  Authenticated (Student or TPO)
export const getAllDrives = async (req, res, next) => {
  try {
    const { status = '', search = '', branch = '' } = req.query;

    const query = {};
    if (status) query.status = status;
    if (branch) query['eligibility.allowedBranches'] = { $in: [branch] };

    let drives = await PlacementDrive.find(query)
      .populate('company', 'name logo website industry location')
      .sort({ applicationDeadline: 1, createdAt: -1 });

    // Update dynamic status based on deadline
    drives.forEach((d) => d.updateStatusBasedOnDeadline());

    if (search.trim()) {
      const s = search.toLowerCase();
      drives = drives.filter(
        (d) =>
          d.jobRole.toLowerCase().includes(s) ||
          d.company?.name.toLowerCase().includes(s) ||
          d.requiredSkills.some((sk) => sk.toLowerCase().includes(s))
      );
    }

    // If request user is a student, compute eligibility and applied status
    let student = null;
    let applicationsMap = {};

    if (req.user && req.user.role === 'student') {
      student = await Student.findOne({ user: req.user._id });
      if (student) {
        const studentApps = await Application.find({ student: student._id });
        studentApps.forEach((app) => {
          applicationsMap[app.drive.toString()] = app;
        });
      }
    }

    const enhancedDrives = drives.map((drive) => {
      const driveObj = drive.toObject();

      if (student) {
        const eligibility = checkEligibility(student, drive);
        const aiMatch = calculateDriveMatch(student, drive);
        const existingApp = applicationsMap[drive._id.toString()];

        driveObj.eligibility = {
          ...driveObj.eligibility,
          isEligible: eligibility.isEligible,
          reasons: eligibility.reasons,
          summary: eligibility.summary,
        };
        driveObj.aiMatchScore = aiMatch.overallMatch;
        driveObj.aiRecommendation = aiMatch.matchRecommendation;
        driveObj.hasApplied = !!existingApp;
        driveObj.applicationId = existingApp?._id || null;
        driveObj.applicationStatus = existingApp?.status || null;
      }

      return driveObj;
    });

    return res.status(200).json({
      success: true,
      count: enhancedDrives.length,
      drives: enhancedDrives,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single drive by ID
// @route   GET /api/drives/:id
// @access  Authenticated
export const getDriveById = async (req, res, next) => {
  try {
    const drive = await PlacementDrive.findById(req.params.id).populate('company');
    if (!drive) {
      return res.status(404).json({ success: false, message: 'Placement drive not found' });
    }

    drive.updateStatusBasedOnDeadline();
    const driveObj = drive.toObject();

    // Check student context
    if (req.user && req.user.role === 'student') {
      const student = await Student.findOne({ user: req.user._id });
      if (student) {
        const eligibility = checkEligibility(student, drive);
        const aiMatch = calculateDriveMatch(student, drive);
        const existingApp = await Application.findOne({
          student: student._id,
          drive: drive._id,
        });

        driveObj.eligibility = {
          ...driveObj.eligibility,
          isEligible: eligibility.isEligible,
          reasons: eligibility.reasons,
          summary: eligibility.summary,
          matchedSkills: eligibility.matchedSkills,
          missingSkills: eligibility.missingSkills,
        };
        driveObj.aiMatch = aiMatch;
        driveObj.hasApplied = !!existingApp;
        driveObj.application = existingApp;
      }
    }

    return res.status(200).json({
      success: true,
      drive: driveObj,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new placement drive (TPO)
// @route   POST /api/drives
// @access  Private (TPO)
export const createDrive = async (req, res, next) => {
  try {
    const {
      company,
      jobRole,
      jobType,
      description,
      package: pkg,
      stipend,
      location,
      eligibility,
      requiredSkills,
      vacancies,
      applicationDeadline,
      selectionProcess,
      testSchedule,
      status,
    } = req.body;

    if (!company || !jobRole || !description || !applicationDeadline) {
      return res.status(400).json({
        success: false,
        message: 'Please provide company, job role, description and application deadline',
      });
    }

    const companyExists = await Company.findById(company);
    if (!companyExists) {
      return res.status(400).json({ success: false, message: 'Referenced company not found' });
    }

    const drive = await PlacementDrive.create({
      company,
      jobRole: jobRole.trim(),
      jobType: jobType || 'Full-Time',
      description: description.trim(),
      package: Number(pkg) || 0,
      stipend: stipend || '',
      location: location || 'Pan India',
      eligibility: {
        minCgpa: Number(eligibility?.minCgpa) || 6.0,
        minTenthPercentage: Number(eligibility?.minTenthPercentage) || 50,
        minTwelfthPercentage: Number(eligibility?.minTwelfthPercentage) || 50,
        allowedBranches: eligibility?.allowedBranches || ['BCA', 'MCA'],
        allowedYears: eligibility?.allowedYears || ['3rd Year', 'Final Year'],
        maxBacklogs: Number(eligibility?.maxBacklogs) || 0,
      },
      requiredSkills: requiredSkills || [],
      vacancies: Number(vacancies) || 1,
      applicationDeadline,
      selectionProcess: selectionProcess || ['Online Assessment', 'Technical Round', 'HR Interview'],
      testSchedule: testSchedule || 'Dates will be intimated via notifications',
      status: status || 'Open',
      createdBy: req.user._id,
    });

    // Send broadcast notification to all students
    await notifyAllStudents({
      type: 'Placement',
      title: `New Placement Drive: ${companyExists.name}`,
      message: `${companyExists.name} is hiring for ${drive.jobRole} (Package: ${drive.package} LPA). Application deadline: ${new Date(drive.applicationDeadline).toLocaleDateString()}.`,
      link: `/student/drives/${drive._id}`,
    });

    const populatedDrive = await PlacementDrive.findById(drive._id).populate('company');

    return res.status(201).json({
      success: true,
      message: 'Placement drive created and published to students',
      drive: populatedDrive,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update placement drive (TPO)
// @route   PUT /api/drives/:id
// @access  Private (TPO)
export const updateDrive = async (req, res, next) => {
  try {
    const drive = await PlacementDrive.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('company');

    if (!drive) {
      return res.status(404).json({ success: false, message: 'Placement drive not found' });
    }

    return res.status(200).json({
      success: true,
      message: 'Placement drive updated successfully',
      drive,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete placement drive (TPO)
// @route   DELETE /api/drives/:id
// @access  Private (TPO)
export const deleteDrive = async (req, res, next) => {
  try {
    const drive = await PlacementDrive.findById(req.params.id);
    if (!drive) {
      return res.status(404).json({ success: false, message: 'Placement drive not found' });
    }

    // Check applications count
    const appCount = await Application.countDocuments({ drive: drive._id });
    if (appCount > 0) {
      // Mark as closed instead of deleting active application histories
      drive.status = 'Closed';
      await drive.save();
      return res.status(200).json({
        success: true,
        message: 'Drive contains student applications, so its status was updated to Closed.',
      });
    }

    await PlacementDrive.findByIdAndDelete(drive._id);
    return res.status(200).json({
      success: true,
      message: 'Placement drive deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
