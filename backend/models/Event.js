import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Event title is required'],
      trim: true,
    },
    category: {
      type: String,
      enum: ['Seminar', 'Workshop', 'Guest Lecture', 'Career Conclave', 'Hackathon'],
      default: 'Workshop',
    },
    speaker: {
      name: { type: String, required: true },
      designation: { type: String, default: '' },
      organization: { type: String, default: '' },
      avatar: { type: String, default: '' },
    },
    date: {
      type: Date,
      required: true,
    },
    time: {
      type: String,
      required: true,
      default: '02:00 PM - 04:30 PM',
    },
    venue: {
      type: String,
      required: true,
      default: 'Main Campus Convention Center',
    },
    mode: {
      type: String,
      enum: ['On-Campus', 'Online', 'Hybrid'],
      default: 'On-Campus',
    },
    meetingLink: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      required: true,
    },
    objectives: [
      {
        type: String,
      },
    ],
    registrationInfo: {
      type: String,
      default: 'Open to all BCA, MCA, and Engineering students. Seats allocated on first-come-first-serve basis.',
    },
    instructions: {
      type: String,
      default: 'Formal college attire required. Carry college ID card.',
    },
    status: {
      type: String,
      enum: ['Upcoming', 'Completed', 'Cancelled'],
      default: 'Upcoming',
    },
    registeredStudents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

const Event = mongoose.model('Event', eventSchema);
export default Event;
