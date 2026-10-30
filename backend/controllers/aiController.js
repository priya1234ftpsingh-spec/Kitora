import Student from '../models/Student.js';
import PlacementDrive from '../models/PlacementDrive.js';
import AIRecommendation from '../models/AIRecommendation.js';
import {
  analyzeResume,
  analyzeSkillGap,
  calculateDriveMatch,
  getCareerRecommendations,
  handleAIChat,
} from '../services/aiService.js';

// @desc    Run AI resume analysis on student's profile & resume
// @route   POST /api/ai/resume-analysis
// @access  Private (Student)
export const analyzeResumeHandler = async (req, res, next) => {
  try {
    const student = await Student.findOne({ user: req.user._id }).populate('user');
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student profile not found' });
    }

    const analysis = await analyzeResume(student, req.body.resumeText || '');

    // Persist to Student and AIRecommendation
    student.resumeScore = analysis.score;
    student.resumeAnalysis = analysis;
    await student.save();

    await AIRecommendation.create({
      student: student._id,
      type: 'resume',
      queryOrContext: 'Resume & Portfolio Audit',
      result: analysis,
    });

    return res.status(200).json({
      success: true,
      analysis,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Run AI skill gap analysis against a role or custom skills
// @route   POST /api/ai/skill-gap
// @access  Private (Student)
export const analyzeSkillGapHandler = async (req, res, next) => {
  try {
    const student = await Student.findOne({ user: req.user._id });
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student profile not found' });
    }

    const { targetRoleOrSkills = 'Full Stack Developer' } = req.body;
    const result = await analyzeSkillGap(student, targetRoleOrSkills);

    await AIRecommendation.create({
      student: student._id,
      type: 'skill_gap',
      queryOrContext: typeof targetRoleOrSkills === 'string' ? targetRoleOrSkills : 'Custom Target',
      result,
    });

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get AI match factor breakdown for a specific placement drive
// @route   GET /api/ai/drive-match/:driveId
// @access  Private (Student)
export const getDriveMatchHandler = async (req, res, next) => {
  try {
    const student = await Student.findOne({ user: req.user._id });
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student profile not found' });
    }

    const drive = await PlacementDrive.findById(req.params.driveId).populate('company');
    if (!drive) {
      return res.status(404).json({ success: false, message: 'Drive not found' });
    }

    const matchAnalysis = calculateDriveMatch(student, drive);

    return res.status(200).json({
      success: true,
      matchAnalysis,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get AI Career direction recommendations
// @route   GET /api/ai/career-recommendations
// @access  Private (Student)
export const getCareerRecommendationsHandler = async (req, res, next) => {
  try {
    const student = await Student.findOne({ user: req.user._id });
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student profile not found' });
    }

    const recommendations = await getCareerRecommendations(student);

    await AIRecommendation.create({
      student: student._id,
      type: 'career',
      queryOrContext: 'Profile Based Career Alignment',
      result: recommendations,
    });

    return res.status(200).json({
      success: true,
      data: recommendations,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Interactive AI Career Assistant Chat
// @route   POST /api/ai/chat
// @access  Private (Student)
export const chatAssistantHandler = async (req, res, next) => {
  try {
    const student = await Student.findOne({ user: req.user._id }).populate('user');
    const { message, chatHistory } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ success: false, message: 'Message is required' });
    }

    const chatResponse = await handleAIChat(student, message, chatHistory);

    return res.status(200).json({
      success: true,
      response: chatResponse,
    });
  } catch (error) {
    next(error);
  }
};
