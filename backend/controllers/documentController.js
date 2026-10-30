import Document from '../models/Document.js';
import Student from '../models/Student.js';
import { notifyStudent } from '../services/notificationService.js';

// @desc    Get student's own documents
// @route   GET /api/documents/my
// @access  Private (Student)
export const getMyDocuments = async (req, res, next) => {
  try {
    const student = await Student.findOne({ user: req.user._id });
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student profile not found' });
    }

    const documents = await Document.find({ student: student._id }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      documents,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload a document (Marksheet, Resume, Certificate)
// @route   POST /api/documents/upload
// @access  Private (Student)
export const uploadDocument = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a file' });
    }

    const student = await Student.findOne({ user: req.user._id });
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student profile not found' });
    }

    const { title, documentType } = req.body;
    const fileUrl = `/uploads/${req.file.filename}`;

    const doc = await Document.create({
      student: student._id,
      title: title || req.file.originalname,
      documentType: documentType || 'Other',
      fileUrl,
      fileName: req.file.originalname,
      fileSize: req.file.size,
      mimeType: req.file.mimetype,
      status: 'Pending',
    });

    // If it's a resume, update resumeUrl in student model
    if (documentType === 'Resume') {
      student.resumeUrl = fileUrl;
      student.calculateProfileCompletion();
      await student.save();
    }

    return res.status(201).json({
      success: true,
      message: 'Document uploaded successfully and queued for TPO verification',
      document: doc,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete student's own document
// @route   DELETE /api/documents/:id
// @access  Private (Student)
export const deleteMyDocument = async (req, res, next) => {
  try {
    const student = await Student.findOne({ user: req.user._id });
    const doc = await Document.findOne({ _id: req.params.id, student: student._id });

    if (!doc) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }

    if (doc.status === 'Verified') {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete a verified document without TPO approval.',
      });
    }

    await Document.findByIdAndDelete(doc._id);

    if (doc.documentType === 'Resume') {
      student.resumeUrl = '';
      student.calculateProfileCompletion();
      await student.save();
    }

    return res.status(200).json({
      success: true,
      message: 'Document removed successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all documents for TPO verification queue
// @route   GET /api/documents
// @access  Private (TPO)
export const getAllDocuments = async (req, res, next) => {
  try {
    const { status = '', documentType = '' } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (documentType) filter.documentType = documentType;

    const documents = await Document.find(filter)
      .populate({
        path: 'student',
        populate: { path: 'user', select: 'name email' },
      })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      documents,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify or Reject a document
// @route   PUT /api/documents/:id/verify
// @access  Private (TPO)
export const verifyDocument = async (req, res, next) => {
  try {
    const { status, rejectionReason } = req.body;

    if (!['Verified', 'Rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status must be either Verified or Rejected',
      });
    }

    if (status === 'Rejected' && !rejectionReason?.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a clear reason for document rejection',
      });
    }

    const doc = await Document.findById(req.params.id).populate('student');
    if (!doc) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }

    doc.status = status;
    doc.rejectionReason = status === 'Rejected' ? rejectionReason.trim() : '';
    doc.verifiedBy = req.user._id;
    doc.verifiedAt = new Date();
    await doc.save();

    // Trigger Notification for the student
    const studentUser = doc.student.user;
    await notifyStudent(studentUser, {
      type: 'Document',
      title: `Document ${status}: ${doc.title}`,
      message:
        status === 'Verified'
          ? `Your document "${doc.title}" has been reviewed and verified by the Placement Cell.`
          : `Your document "${doc.title}" was rejected: ${doc.rejectionReason}. Please re-upload.`,
      link: '/student/documents',
    });

    return res.status(200).json({
      success: true,
      message: `Document successfully marked as ${status}`,
      document: doc,
    });
  } catch (error) {
    next(error);
  }
};
