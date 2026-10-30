import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Public pages
import Landing from '../pages/public/Landing.jsx';
import StudentLogin from '../pages/auth/StudentLogin.jsx';
import StudentRegister from '../pages/auth/StudentRegister.jsx';
import TpoLogin from '../pages/auth/TpoLogin.jsx';

// Layouts and Route Guards
import StudentLayout from '../layouts/StudentLayout.jsx';
import TpoLayout from '../layouts/TpoLayout.jsx';
import ProtectedRoute from './ProtectedRoute.jsx';

// Student pages
import StudentDashboard from '../pages/student/Dashboard.jsx';
import StudentProfile from '../pages/student/Profile.jsx';
import StudentDocuments from '../pages/student/Documents.jsx';
import StudentResume from '../pages/student/Resume.jsx';
import StudentDrives from '../pages/student/PlacementDrives.jsx';
import StudentDriveDetails from '../pages/student/DriveDetails.jsx';
import StudentApplications from '../pages/student/Applications.jsx';
import StudentInterviews from '../pages/student/Interviews.jsx';
import StudentTraining from '../pages/student/Training.jsx';
import StudentSeminars from '../pages/student/Seminars.jsx';
import StudentNotifications from '../pages/student/Notifications.jsx';
import AICareerAssistant from '../pages/student/AICareerAssistant.jsx';
import SkillGap from '../pages/student/SkillGap.jsx';
import StudentSettings from '../pages/student/Settings.jsx';

// TPO pages
import TpoDashboard from '../pages/tpo/Dashboard.jsx';
import TpoStudents from '../pages/tpo/Students.jsx';
import TpoStudentProfile from '../pages/tpo/StudentProfile.jsx';
import TpoDocumentVerification from '../pages/tpo/DocumentVerification.jsx';
import TpoCompanies from '../pages/tpo/Companies.jsx';
import TpoPlacementDrives from '../pages/tpo/PlacementDrives.jsx';
import TpoApplications from '../pages/tpo/Applications.jsx';
import TpoInterviews from '../pages/tpo/Interviews.jsx';
import TpoTraining from '../pages/tpo/Training.jsx';
import TpoSeminars from '../pages/tpo/Seminars.jsx';
import TpoAnnouncements from '../pages/tpo/Announcements.jsx';
import TpoNotifications from '../pages/tpo/Notifications.jsx';
import TpoAnalytics from '../pages/tpo/Analytics.jsx';
import TpoReports from '../pages/tpo/Reports.jsx';
import TpoSettings from '../pages/tpo/Settings.jsx';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<Landing />} />
      <Route path="/login/student" element={<StudentLogin />} />
      <Route path="/register/student" element={<StudentRegister />} />
      <Route path="/login/tpo" element={<TpoLogin />} />

      {/* Protected Student Portal */}
      <Route element={<ProtectedRoute allowedRole="student" />}>
        <Route path="/student" element={<StudentLayout />}>
          <Route index element={<Navigate to="/student/dashboard" replace />} />
          <Route path="dashboard" element={<StudentDashboard />} />
          <Route path="profile" element={<StudentProfile />} />
          <Route path="documents" element={<StudentDocuments />} />
          <Route path="resume" element={<StudentResume />} />
          <Route path="drives" element={<StudentDrives />} />
          <Route path="drives/:id" element={<StudentDriveDetails />} />
          <Route path="applications" element={<StudentApplications />} />
          <Route path="interviews" element={<StudentInterviews />} />
          <Route path="training" element={<StudentTraining />} />
          <Route path="seminars" element={<StudentSeminars />} />
          <Route path="notifications" element={<StudentNotifications />} />
          <Route path="ai-assistant" element={<AICareerAssistant />} />
          <Route path="skill-gap" element={<SkillGap />} />
          <Route path="settings" element={<StudentSettings />} />
        </Route>
      </Route>

      {/* Protected TPO Executive Command Center */}
      <Route element={<ProtectedRoute allowedRole="tpo" />}>
        <Route path="/tpo" element={<TpoLayout />}>
          <Route index element={<Navigate to="/tpo/dashboard" replace />} />
          <Route path="dashboard" element={<TpoDashboard />} />
          <Route path="students" element={<TpoStudents />} />
          <Route path="students/:id" element={<TpoStudentProfile />} />
          <Route path="verification" element={<TpoDocumentVerification />} />
          <Route path="companies" element={<TpoCompanies />} />
          <Route path="drives" element={<TpoPlacementDrives />} />
          <Route path="applications" element={<TpoApplications />} />
          <Route path="interviews" element={<TpoInterviews />} />
          <Route path="training" element={<TpoTraining />} />
          <Route path="seminars" element={<TpoSeminars />} />
          <Route path="announcements" element={<TpoAnnouncements />} />
          <Route path="notifications" element={<TpoNotifications />} />
          <Route path="analytics" element={<TpoAnalytics />} />
          <Route path="reports" element={<TpoReports />} />
          <Route path="settings" element={<TpoSettings />} />
        </Route>
      </Route>

      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
