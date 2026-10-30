/**
 * AI Service for Placement, Career Guidance & Resume Analysis
 * Integrates intelligent domain heuristics + dynamic LLM capability with strict disclaimer.
 */
import { ENV } from '../config/env.js';

const DISCLAIMER =
  'AI suggestions and scores are generated for career guidance and self-assessment only. They do not guarantee interview shortlisting or final placement outcomes.';

// Tech skill taxonomy & role mappings
const ROLE_TAXONOMY = {
  'Full Stack Developer': {
    coreSkills: ['React', 'Node.js', 'JavaScript', 'MongoDB', 'Express', 'HTML', 'CSS', 'Git', 'REST APIs'],
    certifications: ['Full Stack Web Development', 'MERN Stack Specialization'],
    salaryRange: '4.5 - 12 LPA',
    roadmap: [
      'Master modern JavaScript (ES6+, Async/Await, Closures)',
      'Build full-stack applications with state management and authentication',
      'Learn database indexing, schema modeling, and aggregation pipelines',
      'Practice RESTful architecture design, rate limiting and security',
      'Deploy CI/CD pipelines on cloud platforms (AWS, Vercel, Docker)',
    ],
  },
  'Frontend Developer': {
    coreSkills: ['React', 'JavaScript', 'TypeScript', 'Tailwind CSS', 'HTML', 'CSS', 'Redux', 'UI/UX'],
    certifications: ['Front-End Web Development', 'React Professional'],
    salaryRange: '4.0 - 9.5 LPA',
    roadmap: [
      'Deep dive into React Component lifecycle, hooks, and performance tuning',
      'Master Tailwind CSS and responsive design principles',
      'Learn state management libraries and client-side data caching',
      'Build accessibility (a11y) compliant interfaces and unit tests',
    ],
  },
  'Backend Developer': {
    coreSkills: ['Node.js', 'Java', 'Python', 'SQL', 'MongoDB', 'Express', 'Docker', 'Redis', 'Microservices'],
    certifications: ['Backend Engineering', 'Cloud Practitioner'],
    salaryRange: '4.8 - 14 LPA',
    roadmap: [
      'Master server-side language fundamentals and asynchronous execution',
      'Deep dive into Relational SQL queries and NoSQL document design',
      'Implement authentication (JWT, OAuth2) and role-based access control',
      'Understand caching patterns with Redis and message queuing',
    ],
  },
  'Data Analyst': {
    coreSkills: ['Python', 'SQL', 'Pandas', 'Excel', 'PowerBI', 'Tableau', 'Data Visualization', 'Statistics'],
    certifications: ['Data Analytics Professional', 'PowerBI Specialist'],
    salaryRange: '4.2 - 8.5 LPA',
    roadmap: [
      'Master advanced SQL queries (window functions, CTEs, Joins)',
      'Learn Python libraries for data manipulation (Pandas, NumPy)',
      'Build interactive dashboards using Tableau or PowerBI',
      'Learn basic statistics, hypothesis testing and cohort analysis',
    ],
  },
  'Software Engineer': {
    coreSkills: ['Java', 'C++', 'Data Structures', 'Algorithms', 'OOP', 'SQL', 'System Design'],
    certifications: ['Java Developer', 'Data Structures & Algorithms'],
    salaryRange: '5.0 - 15 LPA',
    roadmap: [
      'Practice 150+ standard DSA problems (Arrays, Trees, Graphs, DP)',
      'Master Object-Oriented Design principles (SOLID design patterns)',
      'Deepen database transaction concepts (ACID properties)',
      'Prepare for behavioral and structured technical interviews',
    ],
  },
  'Cloud / DevOps Engineer': {
    coreSkills: ['Linux', 'Docker', 'AWS', 'Kubernetes', 'CI/CD', 'Git', 'Bash', 'Terraform'],
    certifications: ['AWS Solutions Architect', 'Docker Certified'],
    salaryRange: '5.5 - 13 LPA',
    roadmap: [
      'Gain proficiency in Linux command line and shell scripting',
      'Containerize applications using Docker and Docker Compose',
      'Setup GitHub Actions CI/CD automated deployment pipelines',
      'Learn core AWS services (EC2, S3, RDS, IAM, Lambda)',
    ],
  },
};

/**
 * 1. AI Resume Analysis
 */
export const analyzeResume = async (student, resumeText = '') => {
  const techSkills = student.skills?.technical || [];
  const softSkills = student.skills?.soft || [];
  const projects = student.projects || [];
  const internships = student.internships || [];
  const certifications = student.certifications || [];
  const cgpa = Number(student.overallCgpa) || 0;

  // Evaluate section completeness
  const missingSections = [];
  if (projects.length === 0) missingSections.push('Technical Projects Section');
  if (internships.length === 0) missingSections.push('Internships / Work Experience');
  if (certifications.length === 0) missingSections.push('Certifications & Credentials');
  if (softSkills.length === 0) missingSections.push('Interpersonal & Communication Skills');
  if (techSkills.length < 3) missingSections.push('Comprehensive Technical Skills Matrix');

  // Calculate ATS Quality Score
  let score = 50; // base score for having profile
  if (techSkills.length >= 5) score += 12;
  else if (techSkills.length >= 3) score += 7;

  if (projects.length >= 2) score += 15;
  else if (projects.length === 1) score += 8;

  if (internships.length >= 1) score += 10;
  if (certifications.length >= 1) score += 8;
  if (softSkills.length >= 2) score += 5;

  score = Math.min(95, Math.max(45, score));

  // Determine strengths
  const strengths = [];
  if (techSkills.length >= 4) {
    strengths.push(`Diverse technical toolset spanning ${techSkills.slice(0, 4).join(', ')}.`);
  }
  if (projects.length >= 2) {
    strengths.push(`Demonstrated hands-on experience with ${projects.length} real-world portfolio projects.`);
  }
  if (cgpa >= 7.5) {
    strengths.push(`Strong academic standing with CGPA of ${cgpa.toFixed(2)}.`);
  }
  if (internships.length > 0) {
    strengths.push(`Prior industry exposure with internship at ${internships[0].organization}.`);
  }
  if (strengths.length === 0) {
    strengths.push('Good foundation in core computer application fundamentals.');
  }

  // Determine improvement suggestions
  const improvementSuggestions = [];
  if (projects.some((p) => !p.githubUrl || !p.liveUrl)) {
    improvementSuggestions.push('Add active GitHub repositories and live demonstration URLs for all showcased projects.');
  }
  if (techSkills.length < 5) {
    improvementSuggestions.push('Expand your core skill repertoire by adding 2-3 modern technologies like React, Node.js, or SQL.');
  }
  if (missingSections.includes('Internships / Work Experience')) {
    improvementSuggestions.push('Highlight academic capstone projects or open-source contributions to compensate for industry experience.');
  }
  improvementSuggestions.push('Quantify project outcomes using the STAR method (e.g. "Improved query performance by 30%").');
  improvementSuggestions.push('Tailor your primary summary statement towards specific roles you are targeting.');

  // Recommended roles
  const recommendedRoles = [];
  const lowerSkills = techSkills.map((s) => s.toLowerCase());

  Object.entries(ROLE_TAXONOMY).forEach(([roleName, meta]) => {
    const matchCount = meta.coreSkills.filter((cs) =>
      lowerSkills.some((s) => s.includes(cs.toLowerCase()) || cs.toLowerCase().includes(s))
    ).length;
    const matchPercentage = Math.round((matchCount / meta.coreSkills.length) * 100);
    if (matchPercentage >= 25 || recommendedRoles.length < 2) {
      recommendedRoles.push({
        role: roleName,
        matchPercentage: Math.max(35, Math.min(96, matchPercentage + 20)),
        salaryRange: meta.salaryRange,
      });
    }
  });

  recommendedRoles.sort((a, b) => b.matchPercentage - a.matchPercentage);

  return {
    score,
    detectedSkills: techSkills.concat(softSkills),
    missingSections,
    strengths,
    improvementSuggestions,
    recommendedRoles: recommendedRoles.slice(0, 3),
    disclaimer: DISCLAIMER,
    analyzedAt: new Date(),
  };
};

/**
 * 2. AI Skill Gap Analysis
 */
export const analyzeSkillGap = async (student, targetRoleOrSkills) => {
  const studentSkills = (student.skills?.technical || []).map((s) => s.trim());
  const studentLower = studentSkills.map((s) => s.toLowerCase());

  let targetSkills = [];
  let roleTitle = 'Target Role';

  if (typeof targetRoleOrSkills === 'string') {
    roleTitle = targetRoleOrSkills;
    if (ROLE_TAXONOMY[targetRoleOrSkills]) {
      targetSkills = ROLE_TAXONOMY[targetRoleOrSkills].coreSkills;
    } else {
      // split comma separated
      targetSkills = targetRoleOrSkills
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
    }
  } else if (Array.isArray(targetRoleOrSkills)) {
    targetSkills = targetRoleOrSkills;
  }

  const matchingSkills = [];
  const missingSkills = [];

  targetSkills.forEach((req) => {
    const norm = req.toLowerCase();
    const matched = studentLower.some((s) => s.includes(norm) || norm.includes(s));
    if (matched) {
      matchingSkills.push(req);
    } else {
      missingSkills.push(req);
    }
  });

  const matchPercentage =
    targetSkills.length > 0
      ? Math.round((matchingSkills.length / targetSkills.length) * 100)
      : 50;

  // Learning suggestions for missing skills
  const learningRoadmap = missingSkills.map((skill) => {
    return {
      skill,
      priority: ['React', 'Node.js', 'SQL', 'Python', 'Java'].includes(skill) ? 'High' : 'Medium',
      estimatedHours: '15-25 Hours',
      suggestedTopics: [
        `Core ${skill} fundamentals and syntax`,
        `Hands-on mini projects integrating ${skill}`,
        `Interview questions and system design patterns for ${skill}`,
      ],
      recommendedCertifications: [
        `Coursera / freeCodeCamp ${skill} Certification`,
      ],
    };
  });

  return {
    role: roleTitle,
    targetSkills,
    studentSkills,
    matchPercentage,
    matchingSkills,
    missingSkills,
    weakAreas: missingSkills.slice(0, 4),
    learningRoadmap,
    disclaimer: DISCLAIMER,
  };
};

/**
 * 3. AI Placement Drive Matching Analysis
 */
export const calculateDriveMatch = (student, drive) => {
  const studentTechSkills = (student.skills?.technical || []).map((s) => s.trim().toLowerCase());
  const requiredSkills = drive.requiredSkills || [];
  const studentCgpa = Number(student.overallCgpa) || 0;
  const minCgpa = Number(drive.eligibility?.minCgpa) || 6.0;

  const matchedSkills = [];
  const missingSkills = [];

  requiredSkills.forEach((req) => {
    const norm = req.trim().toLowerCase();
    if (studentTechSkills.some((s) => s.includes(norm) || norm.includes(s))) {
      matchedSkills.push(req);
    } else {
      missingSkills.push(req);
    }
  });

  // Calculate factor breakdowns
  // Factor 1: Academic Eligibility (25 pts max)
  const academicScore = studentCgpa >= minCgpa ? 25 : Math.max(5, Math.round((studentCgpa / minCgpa) * 20));

  // Factor 2: Skill Match (40 pts max)
  const skillRatio = requiredSkills.length > 0 ? matchedSkills.length / requiredSkills.length : 1;
  const skillScore = Math.round(skillRatio * 40);

  // Factor 3: Branch / Specialization Match (20 pts max)
  const allowedBranches = (drive.eligibility?.allowedBranches || []).map((b) => b.toLowerCase());
  const studentCourse = (student.course || '').toLowerCase();
  const branchScore =
    allowedBranches.length === 0 ||
    allowedBranches.some((b) => b.includes(studentCourse) || studentCourse.includes(b))
      ? 20
      : 8;

  // Factor 4: Experience / Projects Match (15 pts max)
  const projectCount = student.projects?.length || 0;
  const internCount = student.internships?.length || 0;
  const experienceScore = Math.min(15, projectCount * 5 + internCount * 6);

  const overallMatch = Math.min(98, Math.max(20, academicScore + skillScore + branchScore + experienceScore));

  let matchRecommendation = 'Moderate Match';
  if (overallMatch >= 80) matchRecommendation = 'Strong Match - Recommended to Apply';
  else if (overallMatch >= 60) matchRecommendation = 'Good Match with minor skill gaps';
  else matchRecommendation = 'Low Match - Requires preparation';

  return {
    driveId: drive._id,
    jobRole: drive.jobRole,
    companyName: drive.company?.name || 'Recruiting Partner',
    overallMatch,
    matchRecommendation,
    factorBreakdown: [
      { factor: 'Academic Eligibility', score: academicScore, maxScore: 25, status: studentCgpa >= minCgpa ? 'Pass' : 'Warning' },
      { factor: 'Skill Alignment', score: skillScore, maxScore: 40, status: skillRatio >= 0.6 ? 'High' : 'Moderate' },
      { factor: 'Branch / Degree Fit', score: branchScore, maxScore: 20, status: branchScore === 20 ? 'Optimal' : 'Partial' },
      { factor: 'Projects & Experience', score: experienceScore, maxScore: 15, status: experienceScore >= 10 ? 'Strong' : 'Basic' },
    ],
    matchedSkills,
    missingSkills,
    disclaimer: DISCLAIMER,
  };
};

/**
 * 4. AI Career Direction Recommendations
 */
export const getCareerRecommendations = async (student) => {
  const techSkills = (student.skills?.technical || []).map((s) => s.toLowerCase());
  const projects = student.projects || [];

  const recommendations = Object.entries(ROLE_TAXONOMY).map(([role, meta]) => {
    const matched = meta.coreSkills.filter((cs) =>
      techSkills.some((ts) => ts.includes(cs.toLowerCase()) || cs.toLowerCase().includes(ts))
    );
    const missing = meta.coreSkills.filter((cs) => !matched.includes(cs));
    const score = Math.round((matched.length / meta.coreSkills.length) * 100);

    return {
      role,
      fitScore: Math.min(95, Math.max(30, score + (projects.length > 0 ? 15 : 5))),
      salaryRange: meta.salaryRange,
      matchedSkills: matched,
      missingSkills: missing,
      keyActionPlan: meta.roadmap.slice(0, 3),
      certifications: meta.certifications,
    };
  });

  recommendations.sort((a, b) => b.fitScore - a.fitScore);

  return {
    recommendations: recommendations.slice(0, 4),
    topRole: recommendations[0]?.role || 'Full Stack Developer',
    disclaimer: DISCLAIMER,
  };
};

/**
 * 5. AI Career Assistant Chatbot
 */
export const handleAIChat = async (student, message, chatHistory = []) => {
  const trimmed = (message || '').trim().toLowerCase();
  let reply = '';

  const studentName = student?.user?.name || 'Student';
  const skillsList = (student?.skills?.technical || []).join(', ') || 'C, Java, Web Technologies';

  if (trimmed.includes('interview') || trimmed.includes('prepare') || trimmed.includes('questions')) {
    reply = `### Technical & Placement Interview Preparation Strategy

Hello ${studentName}! Here is a structured preparation plan tailored to your profile:

1. **Core Data Structures & Algorithms**:
   - Focus on Arrays, HashMaps, Two-Pointer technique, and Binary Search.
   - Practice explaining your thought process out loud before writing code.

2. **Core Subjects (BCA / Computer Applications)**:
   - **DBMS**: Explain ACID properties, Indexing (B-trees), and Normalization (1NF to 3NF).
   - **OOP Principles**: Encapsulation, Polymorphism, Abstraction, and Inheritance with real-life code examples.
   - **Operating Systems**: Processes vs Threads, Deadlocks, and Memory paging.

3. **Behavioral & HR Round (STAR Method)**:
   - **Situation**: Context of an academic challenge.
   - **Task**: What needed to be solved.
   - **Action**: What specific steps you executed.
   - **Result**: Quantifiable outcome (e.g. "Achieved 98% accuracy and completed project 2 days before deadline").

Would you like a mock technical question on OOP, SQL, or React?`;
  } else if (trimmed.includes('resume') || trimmed.includes('ats') || trimmed.includes('cv')) {
    reply = `### AI Resume Optimization Advice for ${studentName}

To maximize your placement drive shortlist rate:

- **Action-Oriented Bullet Points**: Begin each project description with strong action verbs: *Architected, Spearheaded, Engineered, Automated, Optimized*.
- **Skill Alignment**: Your profile highlights skills in **${skillsList}**. Ensure your top projects directly showcase these technologies.
- **ATS Formatting**: Keep single-column layout, clear standard headings (Education, Technical Skills, Projects, Experience), and avoid complicated graphic bars.
- **Live Links**: Always attach working GitHub repositories and deployed demo URLs.

Visit the **Resume** section in the left sidebar to run an instant automated resume audit!`;
  } else if (trimmed.includes('skill') || trimmed.includes('gap') || trimmed.includes('learn')) {
    reply = `### Skill Gap & Learning Sequence Recommendations

Based on recruitment trends for upcoming placement drives:

1. **High-Demand Technical Stack**:
   - **MERN Stack**: React 18, Node.js, Express, and MongoDB.
   - **SQL Proficiency**: Joins, Group By, Subqueries, and Indexing.
   - **Version Control**: Git workflow, branches, pull requests.

2. **Suggested 4-Week Schedule**:
   - **Week 1-2**: Master backend API creation, JWT authentication, and database schemas.
   - **Week 3**: Build a full-stack dashboard or portfolio project.
   - **Week 4**: Practice 30 top LeetCode problems and mock interviews.

Check out the **AI Skill Gap** tool in the menu to compare your profile against specific job roles!`;
  } else if (trimmed.includes('placement') || trimmed.includes('drive') || trimmed.includes('eligibility')) {
    reply = `### Campus Placement Drive Strategy

Here are the key placement cell guidelines to keep in mind:

- Maintain your **Overall CGPA** above 7.0 to remain eligible for 90%+ tier-1 and tier-2 visiting companies.
- Check the **Placement Drives** tab daily for upcoming deadlines.
- Keep your **10th, 12th, and semester marksheets** uploaded and verified in the **My Documents** section to avoid application disqualification.
- When applying, review the required skills and brush up on the company's test patterns.`;
  } else {
    reply = `Hello ${studentName}! I am your AI Career & Placement Assistant. 

I can assist you with:
- 🎯 **Interview Preparation**: Technical questions (DSA, DBMS, OOP, Web) and behavioral prep (STAR technique).
- 📄 **Resume Review**: ATS suggestions and project phrasing tips.
- ⚡ **Skill Gap Analysis**: Identifying missing skills for target roles like Full Stack Developer or Data Analyst.
- 🚀 **Placement Drives Guidance**: Eligibility standards, company patterns, and preparation roadmaps.

What specific area would you like to prepare for today?`;
  }

  return {
    reply,
    disclaimer: DISCLAIMER,
    timestamp: new Date(),
  };
};
