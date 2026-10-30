import Student from '../models/Student.js';
import User from '../models/User.js';
import Document from '../models/Document.js';
import Application from '../models/Application.js';
import Interview from '../models/Interview.js';
import Notification from '../models/Notification.js';

// @desc    Get current student's full profile
// @route   GET /api/students/profile
// @access  Private (Student)
export const getMyProfile = async (req, res, next) => {
  try {
    const student = await Student.findOne({ user: req.user._id }).populate(
      'user',
      'name email avatar'
    );
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found',
      });
    }

    // Ensure completion score is fresh
    student.calculateProfileCompletion();
    await student.save();

    return res.status(200).json({
      success: true,
      student,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update current student profile
// @route   PUT /api/students/profile
// @access  Private (Student)
export const updateMyProfile = async (req, res, next) => {
  try {
    let student = await Student.findOne({ user: req.user._id });
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found',
      });
    }

    const {
      name,
      phone,
      dob,
      gender,
      address,
      city,
      state,
      course,
      branch,
      year,
      tenthPercentage,
      twelfthPercentage,
      overallCgpa,
      backlogs,
      semesterMarks,
      skills,
      projects,
      internships,
      certifications,
    } = req.body;

    // Update User name if provided
    if (name) {
      await User.findByIdAndUpdate(req.user._id, { name: name.trim() });
    }

    if (phone !== undefined) student.phone = phone;
    if (dob !== undefined) student.dob = dob;
    if (gender !== undefined) student.gender = gender;
    if (address !== undefined) student.address = address;
    if (city !== undefined) student.city = city;
    if (state !== undefined) student.state = state;

    if (course !== undefined) student.course = course;
    if (branch !== undefined) student.branch = branch;
    if (year !== undefined) student.year = year;
    if (tenthPercentage !== undefined) student.tenthPercentage = Number(tenthPercentage);
    if (twelfthPercentage !== undefined) student.twelfthPercentage = Number(twelfthPercentage);
    if (overallCgpa !== undefined) student.overallCgpa = Number(overallCgpa);
    if (backlogs !== undefined) student.backlogs = Number(backlogs);
    if (semesterMarks !== undefined) student.semesterMarks = semesterMarks;

    if (skills !== undefined) student.skills = skills;
    if (projects !== undefined) student.projects = projects;
    if (internships !== undefined) student.internships = internships;
    if (certifications !== undefined) student.certifications = certifications;

    student.calculateProfileCompletion();
    await student.save();

    const updated = await Student.findById(student._id).populate('user', 'name email avatar');

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      student: updated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Student Dashboard Statistics & Quick Insights
// @route   GET /api/students/dashboard-stats
// @access  Private (Student)
export const getStudentDashboardStats = async (req, res, next) => {
  try {
    const student = await Student.findOne({ user: req.user._id });
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student profile not found' });
    }

    // Active applications
    const activeApplications = await Application.countDocuments({
      student: student._id,
      status: { $in: ['Applied', 'Shortlisted', 'Interview Scheduled'] },
    });

    // Upcoming interviews
    const upcomingInterviews = await Interview.find({
      student: student._id,
      status: 'Scheduled',
    })
      .populate({
        path: 'drive',
        populate: { path: 'company', select: 'name logo' },
      })
      .sort({ date: 1 })
      .limit(3);

    // Document counts
    const documents = await Document.find({ student: student._id });
    const docStats = {
      verified: documents.filter((d) => d.status === 'Verified').length,
      pending: documents.filter((d) => d.status === 'Pending').length,
      rejected: documents.filter((d) => d.status === 'Rejected').length,
      total: documents.length,
    };

    // Unread notifications
    const unreadNotifications = await Notification.countDocuments({
      $or: [
        { recipient: req.user._id, isRead: false },
        { recipient: null, targetRole: { $in: ['student', 'all'] }, readBy: { $ne: req.user._id } },
      ],
    });

    // Recent applications
    const recentApplications = await Application.find({ student: student._id })
      .populate({
        path: 'drive',
        populate: { path: 'company', select: 'name logo' },
      })
      .sort({ appliedAt: -1 })
      .limit(5);

    return res.status(200).json({
      success: true,
      data: {
        profileCompletion: student.profileCompletion || 35,
        placementStatus: student.placementStatus,
        placedCompany: student.placedCompany,
        placedPackage: student.placedPackage,
        activeApplications,
        upcomingInterviewsCount: upcomingInterviews.length,
        upcomingInterviews,
        documentStats: docStats,
        unreadNotifications,
        recentApplications,
        overallCgpa: student.overallCgpa,
        skillsCount: (student.skills?.technical?.length || 0) + (student.skills?.soft?.length || 0),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all students with filtering, search, pagination (TPO)
// @route   GET /api/students
// @access  Private (TPO)
export const getAllStudents = async (req, res, next) => {
  try {
    const {
      search = '',
      branch = '',
      year = '',
      minCgpa = '',
      placementStatus = '',
      page = 1,
      limit = 10,
    } = req.query;

    const query = {};

    if (branch) query.branch = new RegExp(branch, 'i');
    if (year) query.year = year;
    if (minCgpa) query.overallCgpa = { $gte: Number(minCgpa) };
    if (placementStatus) query.placementStatus = placementStatus;

    let students = await Student.find(query)
      .populate('user', 'name email avatar')
      .sort({ createdAt: -1 });

    // Handle search by student name or rollNumber
    if (search.trim()) {
      const s = search.toLowerCase();
      students = students.filter((item) => {
        const nameMatch = item.user?.name?.toLowerCase().includes(s);
        const rollMatch = item.rollNumber?.toLowerCase().includes(s);
        const emailMatch = item.user?.email?.toLowerCase().includes(s);
        return nameMatch || rollMatch || emailMatch;
      });
    }

    const total = students.length;
    const startIndex = (Number(page) - 1) * Number(limit);
    const paginated = students.slice(startIndex, startIndex + Number(limit));

    return res.status(200).json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      students: paginated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get detailed student profile by ID (TPO)
// @route   GET /api/students/:id
// @access  Private (TPO)
export const getStudentById = async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id).populate(
      'user',
      'name email avatar createdAt'
    );

    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    const [documents, applications, interviews] = await Promise.all([
      Document.find({ student: student._id }),
      Application.find({ student: student._id })
        .populate({
          path: 'drive',
          populate: { path: 'company', select: 'name logo' },
        })
        .sort({ appliedAt: -1 }),
      Interview.find({ student: student._id })
        .populate({
          path: 'drive',
          populate: { path: 'company', select: 'name logo' },
        })
        .sort({ date: -1 }),
    ]);

    return res.status(200).json({
      success: true,
      student,
      documents,
      applications,
      interviews,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update student placement status (TPO)
// @route   PUT /api/students/:id/status
// @access  Private (TPO)
export const updateStudentPlacementStatus = async (req, res, next) => {
  try {
    const { placementStatus, placedCompany, placedPackage } = req.body;
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    if (placementStatus) student.placementStatus = placementStatus;
    if (placedCompany !== undefined) student.placedCompany = placedCompany;
    if (placedPackage !== undefined) student.placedPackage = Number(placedPackage);

    await student.save();

    return res.status(200).json({
      success: true,
      message: 'Student placement status updated successfully',
      student,
    });
  } catch (error) {
    next(error);
  }
};
