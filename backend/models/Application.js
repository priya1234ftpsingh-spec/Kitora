import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
    },
    drive: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PlacementDrive',
      required: true,
    },
    appliedAt: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ['Applied', 'Shortlisted', 'Interview Scheduled', 'Selected', 'Rejected', 'Withdrawn'],
      default: 'Applied',
    },
    profileSnapshot: {
      rollNumber: String,
      cgpa: Number,
      branch: String,
      course: String,
      skills: [String],
      resumeUrl: String,
    },
    eligibilityCheck: {
      isEligible: { type: Boolean, default: true },
      matchScore: { type: Number, default: 0 },
      reasons: [{ type: String }],
    },
    currentRound: {
      type: String,
      default: 'Screening',
    },
    feedback: {
      type: String,
      default: '',
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    reviewedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate applications for the same drive by the same student
applicationSchema.index({ student: 1, drive: 1 }, { unique: true });

const Application = mongoose.model('Application', applicationSchema);
export default Application;
