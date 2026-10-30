import Training from '../models/Training.js';
import Student from '../models/Student.js';
import { notifyAllStudents } from '../services/notificationService.js';

// @desc    Get all training programs
// @route   GET /api/trainings
// @access  Authenticated
export const getAllTrainings = async (req, res, next) => {
  try {
    const { status = '', search = '' } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (search.trim()) filter.title = new RegExp(search.trim(), 'i');

    const trainings = await Training.find(filter).sort({ date: 1 });

    let studentId = null;
    if (req.user && req.user.role === 'student') {
      const student = await Student.findOne({ user: req.user._id });
      if (student) studentId = student._id.toString();
    }

    const enhanced = trainings.map((t) => {
      const obj = t.toObject();
      obj.isEnrolled = studentId
        ? (t.enrolledStudents || []).some((id) => id.toString() === studentId)
        : false;
      obj.enrolledCount = t.enrolledStudents?.length || 0;
      return obj;
    });

    return res.status(200).json({
      success: true,
      count: enhanced.length,
      trainings: enhanced,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single training program
// @route   GET /api/trainings/:id
// @access  Authenticated
export const getTrainingById = async (req, res, next) => {
  try {
    const training = await Training.findById(req.params.id);
    if (!training) {
      return res.status(404).json({ success: false, message: 'Training program not found' });
    }

    return res.status(200).json({
      success: true,
      training,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Enroll in training (Student)
// @route   POST /api/trainings/:id/enroll
// @access  Private (Student)
export const enrollInTraining = async (req, res, next) => {
  try {
    const student = await Student.findOne({ user: req.user._id });
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student profile not found' });
    }

    const training = await Training.findById(req.params.id);
    if (!training) {
      return res.status(404).json({ success: false, message: 'Training not found' });
    }

    if (training.enrolledStudents.includes(student._id)) {
      return res.status(400).json({ success: false, message: 'Already enrolled in this training program' });
    }

    training.enrolledStudents.push(student._id);
    await training.save();

    return res.status(200).json({
      success: true,
      message: 'Successfully registered for training program',
      training,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create training program (TPO)
// @route   POST /api/trainings
// @access  Private (TPO)
export const createTraining = async (req, res, next) => {
  try {
    const {
      title,
      description,
      trainerName,
      trainerOrganization,
      targetBatch,
      date,
      time,
      duration,
      mode,
      venueOrLink,
      instructions,
      materials,
    } = req.body;

    if (!title || !description || !trainerName || !date) {
      return res.status(400).json({
        success: false,
        message: 'Please provide training title, description, trainer name and start date',
      });
    }

    const training = await Training.create({
      title: title.trim(),
      description: description.trim(),
      trainerName: trainerName.trim(),
      trainerOrganization: trainerOrganization || 'Placement Cell Industry Partner',
      targetBatch: targetBatch || 'BCA / MCA Students',
      date,
      time: time || '10:00 AM - 01:00 PM',
      duration: duration || '2 Weeks',
      mode: mode || 'Hybrid',
      venueOrLink: venueOrLink || 'Tech Lab 1 & Teams',
      instructions: instructions || 'Laptops required.',
      materials: materials || [],
      createdBy: req.user._id,
    });

    // Notify all students
    await notifyAllStudents({
      type: 'Training',
      title: `New Training Program: ${training.title}`,
      message: `A new placement training module "${training.title}" led by ${training.trainerName} has been scheduled for ${new Date(date).toLocaleDateString()}.`,
      link: '/student/training',
    });

    return res.status(201).json({
      success: true,
      message: 'Training program created successfully',
      training,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update training (TPO)
// @route   PUT /api/trainings/:id
// @access  Private (TPO)
export const updateTraining = async (req, res, next) => {
  try {
    const training = await Training.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!training) {
      return res.status(404).json({ success: false, message: 'Training not found' });
    }

    return res.status(200).json({
      success: true,
      message: 'Training program updated',
      training,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete training (TPO)
// @route   DELETE /api/trainings/:id
// @access  Private (TPO)
export const deleteTraining = async (req, res, next) => {
  try {
    const training = await Training.findByIdAndDelete(req.params.id);
    if (!training) {
      return res.status(404).json({ success: false, message: 'Training not found' });
    }

    return res.status(200).json({
      success: true,
      message: 'Training program removed',
    });
  } catch (error) {
    next(error);
  }
};
