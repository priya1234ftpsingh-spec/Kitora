import React from 'react';
import { Link } from 'react-router-dom';
import {
  GraduationCap,
  Briefcase,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  FileCheck2,
  CalendarCheck2,
  BookOpen,
  ArrowRight,
  CheckCircle2,
  Building2,
  BrainCircuit,
  Award,
} from 'lucide-react';
import Button from '../../components/common/Button.jsx';

const Landing = () => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img src="/Logo.png" alt="Logo" className="h-10 w-10 object-contain rounded-xl shadow-xs" />
            <div>
              <span className="font-extrabold text-slate-900 text-base tracking-tight block">
                KANPUR INSTITUTE OF TECHNOLOGY
              </span>
              <span className="text-[10px] font-semibold text-primary-700 tracking-wider uppercase block">
                AI-Driven Career & Placement Cell
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Link to="/login/student">
              <Button variant="outline" size="sm">
                Student Login
              </Button>
            </Link>
            <Link to="/login/tpo">
              <Button variant="primary" size="sm">
                TPO Executive Login
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* 1. Hero Section */}
      <header className="relative overflow-hidden bg-gradient-to-b from-primary-950 via-primary-900 to-slate-900 text-white pt-20 pb-28">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/30 text-blue-300 text-xs font-semibold mb-6">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>Next-Generation Career Development & Placement Ecosystem</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
            One Platform for Training, Placement & Career Growth.
          </h1>

          <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed">
            A unified college Training & Placement platform connecting students and the
            Placement Cell with automated eligibility verification, drive management, and
            AI-driven career guidance.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/login/student">
              <Button size="lg" variant="accent" className="w-full sm:w-auto shadow-lg shadow-blue-900/30">
                Student Portal Access <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
            <Link to="/register/student">
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-slate-200 border-slate-600 bg-slate-800/80 hover:bg-slate-700">
                New Student Registration
              </Button>
            </Link>
            <Link to="/login/tpo">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                TPO Admin Portal
              </Button>
            </Link>
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-xs font-medium text-slate-400">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Automated Eligibility Checking
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> AI Resume Quality Scoring
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Multi-Round Interview Pipeline
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Verified Document Audits
            </span>
          </div>
        </div>
      </header>

      {/* 2. Platform Introduction & Key Metrics */}
      <section className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-4">
                <Briefcase className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">End-to-End Recruitment</h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                From job posting, automated CGPA/backlog eligibility screening, online applications
                to multiple interview rounds and offer letter issuance.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center mb-4">
                <BrainCircuit className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Advisory AI Intelligence</h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Skill gap analysis, drive compatibility percentages, ATS resume audits, and interactive
                interview preparation bots designed specifically for computer students.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Institutional Governance</h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Strict role-based access control, marksheet and certificate verification by the TPO,
                centralized broadcasts, and real-time placement analytics.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Core Features Showcase */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">
              Platform Features
            </span>
            <h2 className="mt-2 text-3xl font-extrabold text-slate-900 tracking-tight">
              Designed for Academic Rigor & Corporate Agility
            </h2>
            <p className="mt-3 text-sm text-slate-600">
              Everything required to run a high-performance Training & Placement Cell.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
              <div className="h-10 w-10 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center mb-4">
                <Briefcase className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900">Placement Drive Portal</h4>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Publish drives with exact eligibility criteria (CGPA, backlogs, branch, graduation year)
                and track student applications through a transparent progress timeline.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
              <div className="h-10 w-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center mb-4">
                <FileCheck2 className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900">Document Verification Queue</h4>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                TPO reviews 10th, 12th, semester marksheets, and certificates. Rejection requires reasons
                and sends instant notifications to the student.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
              <div className="h-10 w-10 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center mb-4">
                <Sparkles className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900">AI Resume & Skill Gap</h4>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Automated ATS heuristic scores, missing section checklists, and skill comparison against
                target career roles like Full Stack Developer or Data Analyst.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
              <div className="h-10 w-10 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center mb-4">
                <CalendarCheck2 className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900">Interview Scheduling</h4>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Schedule online Google Meet / Teams rounds or on-campus panels, track attendance,
                and log evaluation feedback at each step.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
              <div className="h-10 w-10 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center mb-4">
                <BookOpen className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900">Training & Seminars</h4>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Dedicated modules for bootcamps, technical workshops, and industry guest lectures
                with student RSVPs and curriculum materials.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
              <div className="h-10 w-10 rounded-lg bg-rose-50 text-rose-700 flex items-center justify-center mb-4">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900">Analytics & Reporting</h4>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Visual charts displaying branch-wise placement percentages, package distribution brackets,
                and export-ready tabular reports.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Student & TPO Benefits Split Section */}
      <section className="py-20 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Student Side */}
            <div className="p-8 rounded-2xl bg-gradient-to-br from-slate-50 to-blue-50/50 border border-slate-200">
              <div className="flex items-center space-x-3 mb-6">
                <div className="h-10 w-10 rounded-lg bg-primary-800 text-white flex items-center justify-center font-bold">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">For College Students</h3>
                  <p className="text-xs text-slate-500">Accelerate your placement journey</p>
                </div>
              </div>

              <ul className="space-y-3.5 text-xs text-slate-700">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <span>Maintain an academic profile with semester SGPA, skills, projects, and certifications.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <span>Instant eligibility feedback before applying — no wasted effort on non-qualifying drives.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <span>Real-time timeline tracking: Applied → Shortlisted → Interview → Selection.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <span>AI Career Assistant advising on interview answers, DSA questions, and resume wording.</span>
                </li>
              </ul>

              <div className="mt-8">
                <Link to="/register/student">
                  <Button variant="primary" size="md">
                    Register as Student →
                  </Button>
                </Link>
              </div>
            </div>

            {/* TPO Side */}
            <div className="p-8 rounded-2xl bg-gradient-to-br from-slate-50 to-indigo-50/50 border border-slate-200">
              <div className="flex items-center space-x-3 mb-6">
                <div className="h-10 w-10 rounded-lg bg-indigo-900 text-white flex items-center justify-center font-bold">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">For Training & Placement Cell</h3>
                  <p className="text-xs text-slate-500">Eliminate manual spreadsheets and chaotic paperwork</p>
                </div>
              </div>

              <ul className="space-y-3.5 text-xs text-slate-700">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-indigo-600 mt-0.5 flex-shrink-0" />
                  <span>Complete roster of students with dynamic branch, CGPA, and placement filters.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-indigo-600 mt-0.5 flex-shrink-0" />
                  <span>One-click document approvals with audit logs and student notification triggers.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-indigo-600 mt-0.5 flex-shrink-0" />
                  <span>Centralized company repository and placement drive creation with hard eligibility constraints.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-indigo-600 mt-0.5 flex-shrink-0" />
                  <span>Executive dashboards with charts for placement conversion rates, packages, and reports.</span>
                </li>
              </ul>

              <div className="mt-8">
                <Link to="/login/tpo">
                  <Button variant="primary" size="md" className="bg-indigo-900 hover:bg-indigo-950">
                    TPO Officer Login →
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Call To Action & Credentials Help */}
      <section className="py-16 bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Ready to experience a modern college placement portal?
          </h2>
          <p className="mt-3 text-sm text-slate-300">
            Sign in with the seeded demo credentials or register a student account to test the complete workflow.
          </p>

          <div className="mt-8 p-4 rounded-xl bg-slate-800/80 border border-slate-700 max-w-lg mx-auto text-left text-xs space-y-2">
            <span className="font-bold text-blue-400 block uppercase tracking-wider text-[11px]">
              Pre-Seeded Demo Credentials:
            </span>
            <div className="flex justify-between border-b border-slate-700/60 pb-1.5">
              <span className="text-slate-300 font-medium">TPO Admin:</span>
              <span className="text-slate-100 font-mono">tpo@college.edu / Admin@123</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-300 font-medium">Demo Student:</span>
              <span className="text-slate-100 font-mono">rohit.sharma@student.edu / Student@123</span>
            </div>
          </div>

          <div className="mt-8 flex justify-center gap-4">
            <Link to="/login/student">
              <Button size="md" variant="accent">
                Student Sign In
              </Button>
            </Link>
            <Link to="/login/tpo">
              <Button size="md" variant="outline" className="text-white border-slate-600 hover:bg-slate-800">
                TPO Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 6. Footer */}
      <footer className="bg-slate-950 text-slate-400 py-8 text-xs border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-semibold text-slate-200">
              AI-Driven Training, Placement & Career Development Management System
            </p>
            <p className="text-slate-500 mt-0.5">
              BCA Final Year Academic Project • MERN Architecture with Deep Learning Advisory Layer
            </p>
          </div>
          <p className="text-slate-500 text-[11px]">
            © {new Date().getFullYear()} Training & Placement Cell. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
