import mongoose from 'mongoose';

const trainingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Training title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    trainerName: {
      type: String,
      required: [true, 'Trainer name is required'],
    },
    trainerOrganization: {
      type: String,
      default: 'Industry Expert / Corporate Partner',
    },
    targetBatch: {
      type: String,
      default: 'BCA & MCA Final Year',
    },
    date: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
    },
    time: {
      type: String,
      required: true,
      default: '10:00 AM - 01:00 PM',
    },
    duration: {
      type: String,
      default: '3 Weeks',
    },
    mode: {
      type: String,
      enum: ['Online', 'Offline', 'Hybrid'],
      default: 'Hybrid',
    },
    venueOrLink: {
      type: String,
      required: true,
      default: 'Auditorium Hall A & Live Stream',
    },
    instructions: {
      type: String,
      default: 'Bring laptops with Node.js and VS Code installed.',
    },
    materials: [
      {
        title: { type: String, required: true },
        url: { type: String, required: true },
        type: { type: String, default: 'PDF' },
      },
    ],
    enrolledStudents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
      },
    ],
    status: {
      type: String,
      enum: ['Upcoming', 'Ongoing', 'Completed'],
      default: 'Upcoming',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

const Training = mongoose.model('Training', trainingSchema);
export default Training;
