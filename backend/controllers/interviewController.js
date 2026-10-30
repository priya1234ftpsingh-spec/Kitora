import Interview from '../models/Interview.js';
import Application from '../models/Application.js';
import Student from '../models/Student.js';
import { notifyStudent } from '../services/notificationService.js';

// @desc    Get interviews for student
// @route   GET /api/interviews/my
// @access  Private (Student)
export const getMyInterviews = async (req, res, next) => {
  try {
    const student = await Student.findOne({ user: req.user._id });
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student profile not found' });
    }

    const interviews = await Interview.find({ student: student._id })
      .populate({
        path: 'drive',
        populate: { path: 'company', select: 'name logo location' },
      })
      .sort({ date: 1 });

    return res.status(200).json({
      success: true,
      interviews,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all interviews (TPO)
// @route   GET /api/interviews
// @access  Private (TPO)
export const getAllInterviews = async (req, res, next) => {
  try {
    const { status = '', driveId = '' } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (driveId) filter.drive = driveId;

    const interviews = await Interview.find(filter)
      .populate({
        path: 'student',
        populate: { path: 'user', select: 'name email avatar' },
      })
      .populate({
        path: 'drive',
        populate: { path: 'company', select: 'name logo' },
      })
      .sort({ date: 1 });

    return res.status(200).json({
      success: true,
      interviews,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Schedule interview (TPO)
// @route   POST /api/interviews
// @access  Private (TPO)
export const scheduleInterview = async (req, res, next) => {
  try {
    const {
      applicationId,
      round,
      date,
      time,
      venueType,
      venueOrLink,
      interviewerName,
      instructions,
    } = req.body;

    if (!applicationId || !round || !date || !time || !venueOrLink) {
      return res.status(400).json({
        success: false,
        message: 'Please provide application, round name, date, time and venue/meeting link',
      });
    }

    const application = await Application.findById(applicationId)
      .populate('student')
      .populate({ path: 'drive', populate: { path: 'company' } });

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    const interview = await Interview.create({
      application: application._id,
      student: application.student._id,
      drive: application.drive._id,
      round,
      date,
      time,
      venueType: venueType || 'Online',
      venueOrLink,
      interviewerName: interviewerName || 'Technical Committee',
      instructions: instructions || 'Join on time with your portfolio and student credentials.',
      status: 'Scheduled',
    });

    // Update application status
    application.status = 'Interview Scheduled';
    application.currentRound = round;
    await application.save();

    // Notify Student
    const studentUser = application.student.user;
    await notifyStudent(studentUser, {
      type: 'Interview',
      title: `Interview Scheduled: ${application.drive.company.name}`,
      message: `Your ${round} interview for ${application.drive.jobRole} has been scheduled on ${new Date(date).toLocaleDateString()} at ${time}. Venue/Link: ${venueOrLink}`,
      link: '/student/interviews',
    });

    return res.status(201).json({
      success: true,
      message: 'Interview successfully scheduled and notified to student',
      interview,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update interview details or outcome (TPO)
// @route   PUT /api/interviews/:id
// @access  Private (TPO)
export const updateInterview = async (req, res, next) => {
  try {
    const interview = await Interview.findById(req.params.id)
      .populate('student')
      .populate({ path: 'drive', populate: { path: 'company' } });

    if (!interview) {
      return res.status(404).json({ success: false, message: 'Interview not found' });
    }

    const updated = await Interview.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    // Notify student of schedule adjustment or result
    const studentUser = interview.student.user;
    await notifyStudent(studentUser, {
      type: 'Interview',
      title: `Interview Update: ${interview.drive?.company?.name || 'Recruitment'}`,
      message: `Interview details for ${interview.round} have been updated. Status: ${updated.status}. Check interview schedule page.`,
      link: '/student/interviews',
    });

    return res.status(200).json({
      success: true,
      message: 'Interview updated successfully',
      interview: updated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete interview (TPO)
// @route   DELETE /api/interviews/:id
// @access  Private (TPO)
export const deleteInterview = async (req, res, next) => {
  try {
    const interview = await Interview.findByIdAndDelete(req.params.id);
    if (!interview) {
      return res.status(404).json({ success: false, message: 'Interview not found' });
    }

    return res.status(200).json({
      success: true,
      message: 'Interview record removed',
    });
  } catch (error) {
    next(error);
  }
};
