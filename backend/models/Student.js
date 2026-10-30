import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, default: '' },
  technologies: [{ type: String }],
  githubUrl: { type: String, default: '' },
  liveUrl: { type: String, default: '' },
});

const internshipSchema = new mongoose.Schema({
  organization: { type: String, required: true },
  role: { type: String, required: true },
  duration: { type: String, default: '' },
  description: { type: String, default: '' },
});

const certificationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  issuingOrg: { type: String, required: true },
  issueDate: { type: String, default: '' },
  url: { type: String, default: '' },
  credentialId: { type: String, default: '' },
});

const studentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    // Personal Details
    phone: { type: String, default: '' },
    dob: { type: Date },
    gender: { type: String, enum: ['Male', 'Female', 'Other', ''], default: '' },
    address: { type: String, default: '' },
    city: { type: String, default: '' },
    state: { type: String, default: '' },

    // Academic Details
    course: { type: String, required: true, default: 'BCA' },
    branch: { type: String, required: true, default: 'Computer Applications' },
    year: { type: String, required: true, default: '3rd Year' },
    rollNumber: { type: String, required: true, unique: true },
    tenthPercentage: { type: Number, default: 0 },
    twelfthPercentage: { type: Number, default: 0 },
    semesterMarks: [
      {
        semester: { type: Number },
        sgpa: { type: Number },
      },
    ],
    overallCgpa: { type: Number, default: 0 },
    backlogs: { type: Number, default: 0 },

    // Skills
    skills: {
      technical: [{ type: String }],
      soft: [{ type: String }],
    },

    // Portfolio
    projects: [projectSchema],
    internships: [internshipSchema],
    certifications: [certificationSchema],

    // Placement status
    placementStatus: {
      type: String,
      enum: ['Not Placed', 'Placed', 'Opted Out'],
      default: 'Not Placed',
    },
    placedCompany: { type: String, default: '' },
    placedPackage: { type: Number, default: 0 }, // in LPA

    // Resume tracking
    resumeUrl: { type: String, default: '' },
    resumeScore: { type: Number, default: 0 },
    resumeAnalysis: { type: mongoose.Schema.Types.Mixed, default: null },

    profileCompletion: { type: Number, default: 35 },
  },
  {
    timestamps: true,
  }
);

// Method to calculate profile completion percentage
studentSchema.methods.calculateProfileCompletion = function () {
  let score = 0;
  // Personal info (20%)
  if (this.phone) score += 5;
  if (this.address) score += 5;
  if (this.dob) score += 5;
  if (this.gender) score += 5;

  // Academics (25%)
  if (this.rollNumber) score += 5;
  if (this.tenthPercentage > 0) score += 5;
  if (this.twelfthPercentage > 0) score += 5;
  if (this.overallCgpa > 0) score += 10;

  // Skills (15%)
  if (this.skills?.technical && this.skills.technical.length > 0) score += 10;
  if (this.skills?.soft && this.skills.soft.length > 0) score += 5;

  // Projects & Experience (20%)
  if (this.projects && this.projects.length > 0) score += 10;
  if (this.internships && this.internships.length > 0) score += 10;

  // Certifications & Resume (20%)
  if (this.certifications && this.certifications.length > 0) score += 10;
  if (this.resumeUrl) score += 10;

  this.profileCompletion = Math.min(100, Math.round(score));
  return this.profileCompletion;
};

const Student = mongoose.model('Student', studentSchema);
export default Student;
