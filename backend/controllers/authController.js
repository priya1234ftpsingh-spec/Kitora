import User from '../models/User.js';
import Student from '../models/Student.js';
import { generateToken } from '../utils/generateToken.js';
import { isValidEmail } from '../utils/validators.js';

// @desc    Register a new student
// @route   POST /api/auth/register-student
// @access  Public
export const registerStudent = async (req, res, next) => {
  try {
    const {
      name,
      email,
      password,
      rollNumber,
      course = 'BCA',
      branch = 'Computer Applications',
      year = '3rd Year',
    } = req.body;

    if (!name || !email || !password || !rollNumber) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: Name, Email, Password, Roll Number',
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address',
      });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email address already exists',
      });
    }

    // Check if roll number already exists
    const rollExists = await Student.findOne({ rollNumber: rollNumber.trim().toUpperCase() });
    if (rollExists) {
      return res.status(400).json({
        success: false,
        message: 'A student with this Roll Number is already registered',
      });
    }

    // Create User
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      role: 'student',
    });

    // Create linked Student profile
    const student = await Student.create({
      user: user._id,
      rollNumber: rollNumber.trim().toUpperCase(),
      course: course.trim(),
      branch: branch.trim(),
      year: year.trim(),
      profileCompletion: 35,
    });

    const token = generateToken(user._id, user.role);

    return res.status(201).json({
      success: true,
      message: 'Student account registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      student,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user (Student or TPO)
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res, next) => {
  try {
    const { password, expectedRole } = req.body;
    const loginIdentifier = req.body.emailOrRoll || req.body.email || req.body.identifier;

    if (!loginIdentifier || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please enter both login identifier (email/roll) and password',
      });
    }

    let user;

    // Check if identifier is email or student roll number
    if (isValidEmail(loginIdentifier)) {
      user = await User.findOne({ email: loginIdentifier.toLowerCase().trim() }).select('+password');
    } else {
      // Find student by roll number
      const studentRec = await Student.findOne({ rollNumber: loginIdentifier.trim().toUpperCase() });
      if (studentRec) {
        user = await User.findById(studentRec.user).select('+password');
      }
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. User not found.',
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email/roll number or password.',
      });
    }

    // Role check if expectedRole was passed
    if (expectedRole && user.role !== expectedRole) {
      return res.status(403).json({
        success: false,
        message: `Unauthorized portal. This account does not have ${expectedRole.toUpperCase()} privileges.`,
      });
    }

    const token = generateToken(user._id, user.role);

    let studentProfile = null;
    if (user.role === 'student') {
      studentProfile = await Student.findOne({ user: user._id });
    }

    return res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
      student: studentProfile,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get currently logged in user & profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    let student = null;
    if (user.role === 'student') {
      student = await Student.findOne({ user: user._id });
    }

    return res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
      student,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update password
// @route   PUT /api/auth/update-password
// @access  Private
export const updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id).select('+password');

    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Current password does not match.',
      });
    }

    user.password = newPassword;
    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Password updated successfully',
    });
  } catch (error) {
    next(error);
  }
};
