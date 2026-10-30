import mongoose from 'mongoose';
import { ENV } from '../config/env.js';
import User from '../models/User.js';
import Student from '../models/Student.js';
import Company from '../models/Company.js';
import PlacementDrive from '../models/PlacementDrive.js';
import Application from '../models/Application.js';
import Interview from '../models/Interview.js';
import Training from '../models/Training.js';
import Event from '../models/Event.js';
import Document from '../models/Document.js';
import Announcement from '../models/Announcement.js';
import Notification from '../models/Notification.js';

const seedDatabase = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(ENV.MONGO_URI);
    console.log('Connected! Clearing existing collections...');

    await Promise.all([
      User.deleteMany(),
      Student.deleteMany(),
      Company.deleteMany(),
      PlacementDrive.deleteMany(),
      Application.deleteMany(),
      Interview.deleteMany(),
      Training.deleteMany(),
      Event.deleteMany(),
      Document.deleteMany(),
      Announcement.deleteMany(),
      Notification.deleteMany(),
    ]);

    console.log('Collections cleared. Seeding initial accounts...');

    // 1. Create TPO User
    const tpoUser = await User.create({
      name: 'Dr. Rajesh Sharma',
      email: 'tpo@college.edu',
      password: 'Admin@123',
      role: 'tpo',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    });

    // 2. Create Student Users & Profiles
    const student1User = await User.create({
      name: 'Rohit Sharma',
      email: 'rohit.sharma@student.edu',
      password: 'Student@123',
      role: 'student',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80',
    });

    const student1 = await Student.create({
      user: student1User._id,
      rollNumber: 'BCA2024001',
      course: 'BCA',
      branch: 'Computer Applications',
      year: '3rd Year',
      phone: '+91 9876543210',
      dob: new Date('2003-05-14'),
      gender: 'Male',
      address: 'Hostel Block B, Room 204, College Campus',
      city: 'Pune',
      state: 'Maharashtra',
      tenthPercentage: 88.5,
      twelfthPercentage: 84.0,
      overallCgpa: 8.4,
      backlogs: 0,
      semesterMarks: [
        { semester: 1, sgpa: 8.1 },
        { semester: 2, sgpa: 8.3 },
        { semester: 3, sgpa: 8.5 },
        { semester: 4, sgpa: 8.7 },
      ],
      skills: {
        technical: ['React', 'Node.js', 'Express', 'MongoDB', 'JavaScript', 'Git', 'SQL', 'Tailwind CSS'],
        soft: ['Communication', 'Problem Solving', 'Team Collaboration', 'Presentation'],
      },
      projects: [
        {
          name: 'Campus Event Management Portal',
          description: 'A responsive full-stack platform for booking college auditoriums and managing event registrations.',
          technologies: ['React', 'Node.js', 'MongoDB', 'Express'],
          githubUrl: 'https://github.com/rohitsharma/campus-events',
          liveUrl: 'https://campus-events-demo.vercel.app',
        },
        {
          name: 'AI Smart Expense Tracker',
          description: 'Web dashboard analyzing monthly student expenses and auto-categorizing budgets with visualization charts.',
          technologies: ['React', 'Chart.js', 'Firebase'],
          githubUrl: 'https://github.com/rohitsharma/smart-expense',
          liveUrl: 'https://smart-expense-demo.vercel.app',
        },
      ],
      internships: [
        {
          organization: 'Apex Software Labs',
          role: 'Frontend Web Intern',
          duration: 'June 2024 - August 2024 (2 Months)',
          description: 'Contributed to customer dashboard widgets and optimized render times by 25%.',
        },
      ],
      certifications: [
        {
          name: 'Meta Front-End Developer Professional Certificate',
          issuingOrg: 'Coursera / Meta',
          issueDate: 'March 2024',
          url: 'https://coursera.org/verify/meta-frontend-cert',
          credentialId: 'META-FE-98324',
        },
      ],
      placementStatus: 'Not Placed',
      resumeUrl: '/uploads/sample-resume-rohit.pdf',
      profileCompletion: 85,
    });

    const student2User = await User.create({
      name: 'Priya Patel',
      email: 'priya.patel@student.edu',
      password: 'Student@123',
      role: 'student',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    });

    const student2 = await Student.create({
      user: student2User._id,
      rollNumber: 'BCA2024002',
      course: 'BCA',
      branch: 'Computer Applications',
      year: '3rd Year',
      phone: '+91 9811223344',
      dob: new Date('2003-08-22'),
      gender: 'Female',
      address: 'Flat 402, Green Avenue, Model Colony',
      city: 'Pune',
      state: 'Maharashtra',
      tenthPercentage: 92.0,
      twelfthPercentage: 89.5,
      overallCgpa: 9.1,
      backlogs: 0,
      semesterMarks: [
        { semester: 1, sgpa: 9.0 },
        { semester: 2, sgpa: 9.2 },
        { semester: 3, sgpa: 9.1 },
        { semester: 4, sgpa: 9.3 },
      ],
      skills: {
        technical: ['Python', 'SQL', 'Pandas', 'PowerBI', 'Machine Learning', 'Data Visualization', 'Tableau'],
        soft: ['Critical Thinking', 'Analytical Aptitude', 'Public Speaking'],
      },
      projects: [
        {
          name: 'Placement Trend Predictive Model',
          description: 'Machine learning classification pipeline analyzing five years of placement criteria to predict recruitment odds.',
          technologies: ['Python', 'Scikit-learn', 'Pandas', 'Streamlit'],
          githubUrl: 'https://github.com/priyapatel/placement-ml',
          liveUrl: 'https://placement-ml.streamlit.app',
        },
      ],
      internships: [
        {
          organization: 'DataVerve Analytics',
          role: 'Junior Data Intern',
          duration: 'Jan 2024 - April 2024 (4 Months)',
          description: 'Constructed ETL pipelines in Python and designed executive PowerBI dashboards.',
        },
      ],
      certifications: [
        {
          name: 'Google Data Analytics Professional Certificate',
          issuingOrg: 'Google Career Certificates',
          issueDate: 'January 2024',
          url: 'https://coursera.org/verify/google-data-analytics',
          credentialId: 'GOOGLE-DA-11029',
        },
      ],
      placementStatus: 'Placed',
      placedCompany: 'DataVerve Analytics',
      placedPackage: 7.2,
      resumeUrl: '/uploads/sample-resume-priya.pdf',
      profileCompletion: 92,
    });

    const student3User = await User.create({
      name: 'Amit Verma',
      email: 'amit.verma@student.edu',
      password: 'Student@123',
      role: 'student',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    });

    const student3 = await Student.create({
      user: student3User._id,
      rollNumber: 'BCA2024003',
      course: 'BCA',
      branch: 'Computer Applications',
      year: '3rd Year',
      phone: '+91 9765432109',
      dob: new Date('2003-11-05'),
      gender: 'Male',
      address: '22, Hill View Enclave',
      city: 'Mumbai',
      state: 'Maharashtra',
      tenthPercentage: 74.0,
      twelfthPercentage: 68.0,
      overallCgpa: 6.8,
      backlogs: 1,
      skills: {
        technical: ['Java', 'C++', 'HTML', 'CSS', 'SQL Basics'],
        soft: ['Adaptability', 'Teamwork'],
      },
      placementStatus: 'Not Placed',
      profileCompletion: 55,
    });

    console.log('Students created. Seeding recruitment partner companies...');

    // 3. Create Companies
    const company1 = await Company.create({
      name: 'NexusTech Solutions',
      logo: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=150&q=80',
      description: 'A global digital engineering leader specializing in cloud transformation, modern microservices, and AI products.',
      website: 'https://nexustech-demo.example.com',
      industry: 'Information Technology & Cloud',
      location: 'Bengaluru / Pune / Hybrid',
      contactEmail: 'campus@nexustech-demo.example.com',
      contactPhone: '+91 80 4455 6677',
      isActive: true,
    });

    const company2 = await Company.create({
      name: 'DataVerve Analytics',
      logo: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=150&q=80',
      description: 'Enterprise business intelligence, data lake engineering, and generative AI analytics consultancy.',
      website: 'https://dataverve-demo.example.com',
      industry: 'Data & Artificial Intelligence',
      location: 'Hyderabad / Pune',
      contactEmail: 'talent@dataverve-demo.example.com',
      contactPhone: '+91 40 2345 8899',
      isActive: true,
    });

    const company3 = await Company.create({
      name: 'Apex Cyber Systems',
      logo: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=150&q=80',
      description: 'Cybersecurity defense solutions, enterprise network infrastructure and cloud platform reliability.',
      website: 'https://apexcyber-demo.example.com',
      industry: 'Cybersecurity & Cloud Systems',
      location: 'Gurugram / Noida',
      contactEmail: 'careers@apexcyber-demo.example.com',
      contactPhone: '+91 124 5566 778',
      isActive: true,
    });

    const company4 = await Company.create({
      name: 'InnoWave Global',
      logo: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=150&q=80',
      description: 'Modern financial technology platform building high-frequency payment gateways and micro-banking apps.',
      website: 'https://innowave-demo.example.com',
      industry: 'Fintech & SaaS',
      location: 'Mumbai / Hybrid',
      contactEmail: 'campus-hiring@innowave-demo.example.com',
      contactPhone: '+91 22 8899 0011',
      isActive: true,
    });

    console.log('Companies created. Seeding placement drives...');

    // 4. Create Placement Drives
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);

    const nextTwoDays = new Date();
    nextTwoDays.setDate(nextTwoDays.getDate() + 2);

    const pastWeek = new Date();
    pastWeek.setDate(pastWeek.getDate() - 10);

    const drive1 = await PlacementDrive.create({
      company: company1._id,
      jobRole: 'Associate Software Engineer',
      jobType: 'Full-Time',
      description: 'Responsible for developing robust web services using React, Node.js and REST APIs. Collaborating with Agile engineering teams to build performant digital software.',
      package: 6.5,
      stipend: '₹25,000 / month (first 3 months training)',
      location: 'Pune / Bengaluru (Hybrid)',
      eligibility: {
        minCgpa: 7.0,
        minTenthPercentage: 60,
        minTwelfthPercentage: 60,
        allowedBranches: ['BCA', 'MCA', 'Computer Applications', 'B.Sc CS'],
        allowedYears: ['3rd Year', 'Final Year'],
        maxBacklogs: 0,
      },
      requiredSkills: ['React', 'Node.js', 'JavaScript', 'MongoDB', 'Git', 'REST APIs'],
      vacancies: 8,
      applicationDeadline: nextWeek,
      selectionProcess: ['Round 1: Online Technical Assessment (MCQ + 2 Coding Problems)', 'Round 2: Technical Interview (DSA + Project Discussion)', 'Round 3: HR & Management Discussion'],
      testSchedule: 'October 24, 2026 - 10:00 AM Online Assessment',
      status: 'Open',
      createdBy: tpoUser._id,
    });

    const drive2 = await PlacementDrive.create({
      company: company2._id,
      jobRole: 'Junior Data Analyst',
      jobType: 'Full-Time',
      description: 'Analyze operational client datasets, develop SQL aggregation pipelines, build interactive PowerBI reports, and participate in predictive modeling workshops.',
      package: 5.8,
      location: 'Pune / Hyderabad',
      eligibility: {
        minCgpa: 6.5,
        minTenthPercentage: 60,
        minTwelfthPercentage: 60,
        allowedBranches: ['BCA', 'MCA', 'Computer Applications', 'B.Sc CS', 'B.Sc Statistics'],
        allowedYears: ['3rd Year', 'Final Year'],
        maxBacklogs: 0,
      },
      requiredSkills: ['Python', 'SQL', 'PowerBI', 'Data Visualization', 'Pandas'],
      vacancies: 5,
      applicationDeadline: nextTwoDays,
      selectionProcess: ['Round 1: SQL & Data Aptitude Test', 'Round 2: Case Study Presentation', 'Round 3: Leadership Interview'],
      testSchedule: 'October 18, 2026 - Campus Computer Lab 3',
      status: 'Closing Soon',
      createdBy: tpoUser._id,
    });

    const drive3 = await PlacementDrive.create({
      company: company3._id,
      jobRole: 'Graduate Systems Engineer',
      jobType: 'Full-Time',
      description: 'Support cloud operations, monitor Linux server metrics, write bash automated scripting, and participate in security patch governance.',
      package: 4.8,
      location: 'Noida / Gurugram',
      eligibility: {
        minCgpa: 6.0,
        minTenthPercentage: 55,
        minTwelfthPercentage: 55,
        allowedBranches: ['BCA', 'MCA', 'Computer Applications', 'B.Tech CS'],
        allowedYears: ['3rd Year', 'Final Year'],
        maxBacklogs: 1,
      },
      requiredSkills: ['Linux', 'Java', 'Networking Basics', 'SQL', 'Troubleshooting'],
      vacancies: 12,
      applicationDeadline: nextWeek,
      selectionProcess: ['Round 1: Cognitive & Tech Aptitude Test', 'Round 2: Technical & Core OS Interview', 'Round 3: HR Fitment'],
      testSchedule: 'November 2, 2026',
      status: 'Open',
      createdBy: tpoUser._id,
    });

    const drive4 = await PlacementDrive.create({
      company: company4._id,
      jobRole: 'Full Stack Developer Trainee',
      jobType: 'Internship + PPO',
      description: 'Build responsive financial dashboard micro-frontends with React and secure high-scale payment microservices with Express and Redis.',
      package: 8.0,
      stipend: '₹35,000 / month internship stipend',
      location: 'Mumbai (On-Site)',
      eligibility: {
        minCgpa: 7.5,
        minTenthPercentage: 70,
        minTwelfthPercentage: 70,
        allowedBranches: ['BCA', 'MCA', 'Computer Applications'],
        allowedYears: ['3rd Year', 'Final Year'],
        maxBacklogs: 0,
      },
      requiredSkills: ['React', 'TypeScript', 'Node.js', 'MongoDB', 'Docker', 'Git'],
      vacancies: 4,
      applicationDeadline: nextWeek,
      selectionProcess: ['Round 1: 90 Min Coding Assessment (LeetCode Medium)', 'Round 2: Live System Architecture Pairing', 'Round 3: Executive Interview'],
      testSchedule: 'November 8, 2026',
      status: 'Open',
      createdBy: tpoUser._id,
    });

    console.log('Placement drives created. Seeding applications and interviews...');

    // 5. Create Applications
    const app1 = await Application.create({
      student: student1._id,
      drive: drive1._id,
      appliedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      status: 'Interview Scheduled',
      currentRound: 'Technical Interview Round 1',
      profileSnapshot: {
        rollNumber: student1.rollNumber,
        cgpa: student1.overallCgpa,
        branch: student1.branch,
        course: student1.course,
        skills: student1.skills.technical,
        resumeUrl: student1.resumeUrl,
      },
      eligibilityCheck: {
        isEligible: true,
        matchScore: 88,
        reasons: ['All academic criteria met.'],
      },
      reviewedBy: tpoUser._id,
      reviewedAt: new Date(),
    });

    const app2 = await Application.create({
      student: student2._id,
      drive: drive2._id,
      appliedAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
      status: 'Selected',
      currentRound: 'Selected',
      feedback: 'Outstanding technical score in SQL assessment and clear domain articulation.',
      profileSnapshot: {
        rollNumber: student2.rollNumber,
        cgpa: student2.overallCgpa,
        branch: student2.branch,
        course: student2.course,
        skills: student2.skills.technical,
        resumeUrl: student2.resumeUrl,
      },
      eligibilityCheck: {
        isEligible: true,
        matchScore: 94,
        reasons: ['All academic criteria met.'],
      },
      reviewedBy: tpoUser._id,
      reviewedAt: new Date(),
    });

    // 6. Create Interviews
    const interviewDate = new Date();
    interviewDate.setDate(interviewDate.getDate() + 3);

    await Interview.create({
      application: app1._id,
      student: student1._id,
      drive: drive1._id,
      round: 'Round 2 - Technical Interview',
      date: interviewDate,
      time: '11:00 AM - 11:45 AM',
      venueType: 'Online',
      venueOrLink: 'https://meet.google.com/xyz-placement-nexustech',
      interviewerName: 'Mr. Arvind Gupta (Lead Architect, NexusTech)',
      instructions: 'Please be online 10 mins prior. Keep your code editor and GitHub project repository ready for screen share.',
      status: 'Scheduled',
    });

    console.log('Interviews created. Seeding training & seminars...');

    // 7. Create Training Programs
    const training1 = await Training.create({
      title: 'Full Stack MERN Architecture & Enterprise Microservices',
      description: 'An intensive 4-week placement readiness bootcamp covering React performance optimizations, state management patterns, Express REST APIs, MongoDB aggregation pipelines, and deployment on Docker/AWS.',
      trainerName: 'Vikramaditya Sengupta',
      trainerOrganization: 'Senior Engineering Architect, CloudMatrix',
      targetBatch: 'BCA 3rd Year & MCA Final Year',
      date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      time: '10:00 AM - 01:00 PM',
      duration: '4 Weeks (Weekends)',
      mode: 'Hybrid',
      venueOrLink: 'Auditorium Hall A & Live Microsoft Teams',
      instructions: 'Bring laptops with Node.js LTS, Git, and VS Code installed.',
      materials: [
        { title: 'Bootcamp Syllabus & Pre-requisites', url: '/uploads/mern-bootcamp-syllabus.pdf', type: 'PDF' },
        { title: 'MERN Code Sandbox Starter Kit', url: 'https://github.com/tnp-cell/mern-starter', type: 'GitHub' },
      ],
      enrolledStudents: [student1._id, student2._id],
      status: 'Upcoming',
      createdBy: tpoUser._id,
    });

    const training2 = await Training.create({
      title: 'Campus to Corporate: Technical Interview Mastery & Mock Coding',
      description: 'Practical training on solving Top 100 Data Structures & Algorithms patterns, handling behavioral STAR interview questions, and acing recruiter discussions.',
      trainerName: 'Ananya Deshmukh',
      trainerOrganization: 'Ex-Amazon Tech Recruiter & Career Coach',
      targetBatch: 'All Pre-Final & Final Year Students',
      date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      time: '02:00 PM - 05:00 PM',
      duration: '2 Weeks',
      mode: 'Offline',
      venueOrLink: 'Seminar Hall 3, Department of Computer Applications',
      instructions: 'Pen, notepad, and college identity card mandatory.',
      enrolledStudents: [student1._id],
      status: 'Upcoming',
      createdBy: tpoUser._id,
    });

    // 8. Create Seminars & Workshops
    await Event.create({
      title: 'Generative AI & LLMs in Production Software Engineering',
      category: 'Workshop',
      speaker: {
        name: 'Dr. Sameer Kulkarni',
        designation: 'Principal AI Research Scientist',
        organization: 'DeepAI Labs',
      },
      date: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
      time: '02:00 PM - 04:30 PM',
      venue: 'Main Campus Convention Center',
      mode: 'On-Campus',
      description: 'Hands-on interactive session examining how generative AI models, vector databases, and agentic workflows are redefining commercial application development.',
      objectives: [
        'Understand foundational Transformer architecture',
        'Learn RAG (Retrieval Augmented Generation) pipeline design',
        'Explore career pathways in Modern AI Engineering',
      ],
      registrationInfo: 'Open to BCA and MCA students. Limited to 150 attendees.',
      instructions: 'Formal uniform dress code required.',
      registeredStudents: [student1._id],
      status: 'Upcoming',
      createdBy: tpoUser._id,
    });

    await Event.create({
      title: 'Cracking Cloud & DevOps Careers: AWS Architecture Essentials',
      category: 'Seminar',
      speaker: {
        name: 'Pooja Nair',
        designation: 'Senior Cloud Solutions Architect',
        organization: 'Amazon Web Services',
      },
      date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      time: '11:00 AM - 01:30 PM',
      venue: 'Virtual Global Stream',
      mode: 'Online',
      meetingLink: 'https://teams.microsoft.com/meet/aws-cloud-career',
      description: 'A deep-dive seminar exploring cloud computing paradigms, Kubernetes microservices, CI/CD pipelines, and practical AWS certifications that recruiters value.',
      objectives: [
        'Demystify cloud infrastructure roles',
        'Demonstrate zero-downtime deployment pipelines',
        'Discuss high-demand DevOps market salaries',
      ],
      registrationInfo: 'Open to all computer stream batches.',
      instructions: 'Please install MS Teams client.',
      registeredStudents: [student2._id],
      status: 'Upcoming',
      createdBy: tpoUser._id,
    });

    console.log('Seeding student documents & verification statuses...');

    // 9. Documents
    await Document.create({
      student: student1._id,
      title: 'Rohit Sharma - Final Year Resume',
      documentType: 'Resume',
      fileUrl: '/uploads/sample-resume-rohit.pdf',
      fileName: 'Rohit_Sharma_Resume.pdf',
      fileSize: 420000,
      mimeType: 'application/pdf',
      status: 'Verified',
      verifiedBy: tpoUser._id,
      verifiedAt: new Date(),
    });

    await Document.create({
      student: student1._id,
      title: 'Class 10th Board Marksheet',
      documentType: '10th Marksheet',
      fileUrl: '/uploads/rohit-10th-marksheet.pdf',
      fileName: 'Rohit_10th_Marksheet.pdf',
      fileSize: 310000,
      mimeType: 'application/pdf',
      status: 'Verified',
      verifiedBy: tpoUser._id,
      verifiedAt: new Date(),
    });

    await Document.create({
      student: student1._id,
      title: 'Semester 4 Consolidated Grade Card',
      documentType: 'College Marksheet',
      fileUrl: '/uploads/rohit-sem4-marksheet.pdf',
      fileName: 'Rohit_Sem4_Marksheet.pdf',
      fileSize: 280000,
      mimeType: 'application/pdf',
      status: 'Pending',
    });

    await Document.create({
      student: student2._id,
      title: 'Priya Patel - Data Science Resume',
      documentType: 'Resume',
      fileUrl: '/uploads/sample-resume-priya.pdf',
      fileName: 'Priya_Patel_Resume.pdf',
      fileSize: 390000,
      mimeType: 'application/pdf',
      status: 'Verified',
      verifiedBy: tpoUser._id,
      verifiedAt: new Date(),
    });

    await Document.create({
      student: student3._id,
      title: 'Class 12th Board Marksheet',
      documentType: '12th Marksheet',
      fileUrl: '/uploads/amit-12th-marksheet.pdf',
      fileName: 'Amit_12th_Marksheet.pdf',
      fileSize: 340000,
      mimeType: 'application/pdf',
      status: 'Rejected',
      rejectionReason: 'Document scan is blurry. Roll number and total marks are not legible.',
      verifiedBy: tpoUser._id,
      verifiedAt: new Date(),
    });

    console.log('Seeding announcements and notifications...');

    // 10. Announcements
    await Announcement.create({
      title: 'Mandatory Document Verification for Final Year Batch 2024-2025',
      message: 'All BCA III Year students participating in upcoming campus placement drives must upload their 10th, 12th, and all semester marksheets in the My Documents section by October 25, 2026 for TPO verification.',
      category: 'Policy',
      priority: 'High',
      targetAudience: 'All Students',
      createdBy: tpoUser._id,
    });

    await Announcement.create({
      title: 'NexusTech Solutions Recruitment Drive Registration Open',
      message: 'NexusTech Solutions has released 8 vacancies for the Associate Software Engineer profile at 6.5 LPA. Eligible BCA students with CGPA >= 7.0 and zero active backlogs can submit their applications online.',
      category: 'Placement Drive',
      priority: 'Urgent',
      targetAudience: 'All Students',
      createdBy: tpoUser._id,
    });

    // 11. Notifications
    await Notification.create({
      recipient: student1User._id,
      targetRole: 'student',
      type: 'Interview',
      title: 'Technical Interview Scheduled: NexusTech Solutions',
      message: `Your technical interview for Associate Software Engineer is scheduled on ${interviewDate.toLocaleDateString()} at 11:00 AM. Check Interview Schedule for link.`,
      link: '/student/interviews',
      isRead: false,
    });

    await Notification.create({
      recipient: student1User._id,
      targetRole: 'student',
      type: 'Document',
      title: 'Resume Verified by Placement Cell',
      message: 'Your uploaded resume has been reviewed and verified by TPO Dr. Rajesh Sharma.',
      link: '/student/documents',
      isRead: true,
    });

    await Notification.create({
      recipient: null,
      targetRole: 'student',
      type: 'Placement',
      title: 'New Placement Drive Published: DataVerve Analytics',
      message: 'DataVerve Analytics is hiring Junior Data Analysts at 5.8 LPA. Application deadline is approaching.',
      link: `/student/drives/${drive2._id}`,
      readBy: [],
    });

    console.log('----------------------------------------------------');
    console.log('DATABASE SEEDED SUCCESSFULLY!');
    console.log('Demo Credentials:');
    console.log('TPO Admin:');
    console.log('  Email:    tpo@college.edu');
    console.log('  Password: Admin@123');
    console.log('Demo Student:');
    console.log('  Email:    rohit.sharma@student.edu (or Roll: BCA2024001)');
    console.log('  Password: Student@123');
    console.log('----------------------------------------------------');

    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedDatabase();
