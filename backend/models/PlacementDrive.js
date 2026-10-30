import mongoose from 'mongoose';

const placementDriveSchema = new mongoose.Schema(
  {
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: [true, 'Company reference is required'],
    },
    jobRole: {
      type: String,
      required: [true, 'Job role is required'],
      trim: true,
    },
    jobType: {
      type: String,
      enum: ['Full-Time', 'Internship', 'Internship + PPO'],
      default: 'Full-Time',
    },
    description: {
      type: String,
      required: [true, 'Job description is required'],
    },
    package: {
      type: Number, // In LPA (Lakhs per annum)
      required: [true, 'Package is required'],
      default: 0,
    },
    stipend: {
      type: String,
      default: '',
    },
    location: {
      type: String,
      default: 'Bengaluru / Pune / Hybrid',
    },
    eligibility: {
      minCgpa: {
        type: Number,
        default: 6.0,
      },
      minTenthPercentage: {
        type: Number,
        default: 50,
      },
      minTwelfthPercentage: {
        type: Number,
        default: 50,
      },
      allowedBranches: {
        type: [String],
        default: ['BCA', 'MCA', 'B.Sc CS', 'B.Tech CS'],
      },
      allowedYears: {
        type: [String],
        default: ['3rd Year', 'Final Year'],
      },
      maxBacklogs: {
        type: Number,
        default: 0,
      },
    },
    requiredSkills: [{ type: String }],
    vacancies: {
      type: Number,
      default: 5,
    },
    applicationDeadline: {
      type: Date,
      required: [true, 'Application deadline is required'],
    },
    selectionProcess: [
      {
        type: String,
      },
    ],
    testSchedule: {
      type: String,
      default: 'To be announced post shortlisting',
    },
    status: {
      type: String,
      enum: ['Open', 'Closing Soon', 'Closed', 'Draft'],
      default: 'Open',
    },
    isPublished: {
      type: Boolean,
      default: true,
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

// Virtual/Helper to determine drive dynamic status
placementDriveSchema.methods.updateStatusBasedOnDeadline = function () {
  const now = new Date();
  if (now > this.applicationDeadline) {
    this.status = 'Closed';
  } else {
    const diffHours = (this.applicationDeadline - now) / (1000 * 60 * 60);
    if (diffHours <= 48 && this.status !== 'Closed') {
      this.status = 'Closing Soon';
    } else if (this.status !== 'Draft' && this.status !== 'Closed') {
      this.status = 'Open';
    }
  }
};

const PlacementDrive = mongoose.model('PlacementDrive', placementDriveSchema);
export default PlacementDrive;
