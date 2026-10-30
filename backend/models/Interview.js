import mongoose from 'mongoose';

const interviewSchema = new mongoose.Schema(
  {
    application: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Application',
      required: true,
    },
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
    round: {
      type: String,
      required: true,
      default: 'Technical Interview',
    },
    date: {
      type: Date,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    venueType: {
      type: String,
      enum: ['Online', 'On-Campus', 'Hybrid'],
      default: 'Online',
    },
    venueOrLink: {
      type: String,
      required: true,
    },
    interviewerName: {
      type: String,
      default: 'Technical Panel',
    },
    instructions: {
      type: String,
      default: 'Please be ready 10 minutes prior with your updated resume, college ID card and portfolio links.',
    },
    status: {
      type: String,
      enum: ['Scheduled', 'Completed', 'Cancelled', 'Rescheduled', 'Absent'],
      default: 'Scheduled',
    },
    result: {
      type: String,
      enum: ['Pending', 'Passed', 'Failed'],
      default: 'Pending',
    },
    feedback: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

const Interview = mongoose.model('Interview', interviewSchema);
export default Interview;
