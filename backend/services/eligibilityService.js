/**
 * Eligibility Service
 * Evaluates whether a student meets the criteria for a specific placement drive.
 */
export const checkEligibility = (student, drive) => {
  const reasons = [];
  let isEligible = true;

  if (!student || !drive) {
    return {
      isEligible: false,
      reasons: ['Student or Drive details missing.'],
      matchScore: 0,
      matchedSkills: [],
      missingSkills: [],
    };
  }

  const { eligibility = {}, requiredSkills = [] } = drive;

  // 1. CGPA check
  const studentCgpa = Number(student.overallCgpa) || 0;
  const minCgpa = Number(eligibility.minCgpa) || 0;
  if (studentCgpa < minCgpa) {
    isEligible = false;
    reasons.push(
      `CGPA requirement not met: Your CGPA is ${studentCgpa.toFixed(2)}, required is ${minCgpa.toFixed(2)}.`
    );
  }

  // 2. 10th percentage check
  const studentTenth = Number(student.tenthPercentage) || 0;
  const minTenth = Number(eligibility.minTenthPercentage) || 0;
  if (minTenth > 0 && studentTenth < minTenth) {
    isEligible = false;
    reasons.push(
      `10th grade percentage requirement not met: You have ${studentTenth}%, required is ${minTenth}%.`
    );
  }

  // 3. 12th percentage check
  const studentTwelfth = Number(student.twelfthPercentage) || 0;
  const minTwelfth = Number(eligibility.minTwelfthPercentage) || 0;
  if (minTwelfth > 0 && studentTwelfth < minTwelfth) {
    isEligible = false;
    reasons.push(
      `12th grade percentage requirement not met: You have ${studentTwelfth}%, required is ${minTwelfth}%.`
    );
  }

  // 4. Backlog check
  const studentBacklogs = Number(student.backlogs) || 0;
  const maxBacklogs = Number(eligibility.maxBacklogs) || 0;
  if (studentBacklogs > maxBacklogs) {
    isEligible = false;
    reasons.push(
      `Backlog limit exceeded: You have ${studentBacklogs} active backlogs, allowed max is ${maxBacklogs}.`
    );
  }

  // 5. Branch/Course check
  const allowedBranches = (eligibility.allowedBranches || []).map((b) =>
    b.trim().toLowerCase()
  );
  const studentCourse = (student.course || '').trim().toLowerCase();
  const studentBranch = (student.branch || '').trim().toLowerCase();

  if (allowedBranches.length > 0) {
    const isBranchAllowed = allowedBranches.some((allowed) => {
      return (
        studentCourse.includes(allowed) ||
        allowed.includes(studentCourse) ||
        studentBranch.includes(allowed) ||
        allowed.includes(studentBranch)
      );
    });

    if (!isBranchAllowed) {
      isEligible = false;
      reasons.push(
        `Department/Branch not eligible: Drive is open to [${eligibility.allowedBranches.join(', ')}].`
      );
    }
  }

  // 6. Year check
  const allowedYears = (eligibility.allowedYears || []).map((y) =>
    y.trim().toLowerCase()
  );
  const studentYear = (student.year || '').trim().toLowerCase();
  if (allowedYears.length > 0) {
    const isYearAllowed = allowedYears.some(
      (y) => studentYear.includes(y) || y.includes(studentYear)
    );
    if (!isYearAllowed) {
      isEligible = false;
      reasons.push(
        `Graduation year not eligible: Drive is targeted for [${eligibility.allowedYears.join(', ')}].`
      );
    }
  }

  // 7. Calculate Skills Matching
  const studentTechSkills = (student.skills?.technical || []).map((s) =>
    s.trim().toLowerCase()
  );
  const matchedSkills = [];
  const missingSkills = [];

  requiredSkills.forEach((reqSkill) => {
    const norm = reqSkill.trim().toLowerCase();
    const found = studentTechSkills.some(
      (s) => s.includes(norm) || norm.includes(s)
    );
    if (found) {
      matchedSkills.push(reqSkill);
    } else {
      missingSkills.push(reqSkill);
    }
  });

  // Calculate Match Score (0 - 100)
  let matchScore = 0;
  // 40% based on eligibility criteria
  const criteriaPoints = isEligible ? 40 : 10;
  // 35% based on skill coverage
  let skillPoints = 0;
  if (requiredSkills.length > 0) {
    skillPoints = Math.round((matchedSkills.length / requiredSkills.length) * 35);
  } else {
    skillPoints = 35;
  }
  // 15% based on CGPA weight
  const cgpaPoints = Math.min(15, Math.round((studentCgpa / 10) * 15));
  // 10% based on project/internship experience
  const projectPoints = (student.projects?.length || 0) > 0 ? 5 : 0;
  const internPoints = (student.internships?.length || 0) > 0 ? 5 : 0;

  matchScore = criteriaPoints + skillPoints + cgpaPoints + projectPoints + internPoints;
  matchScore = Math.min(100, Math.max(15, matchScore));

  return {
    isEligible,
    reasons: reasons.length === 0 ? ['All eligibility criteria met.'] : reasons,
    matchScore,
    matchedSkills,
    missingSkills,
    summary: isEligible
      ? 'You are eligible to apply for this placement drive.'
      : 'You are currently not eligible to apply for this drive.',
  };
};
