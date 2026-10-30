import React, { useState, useEffect } from 'react';
import {
  FileText,
  Upload,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Briefcase,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth.js';
import { useNotifications } from '../../hooks/useNotifications.js';
import { studentService } from '../../services/studentService.js';
import { documentService } from '../../services/documentService.js';
import { aiService } from '../../services/aiService.js';
import Button from '../../components/common/Button.jsx';
import Badge from '../../components/common/Badge.jsx';
import Loader from '../../components/common/Loader.jsx';

const Resume = () => {
  const { student, refreshUser } = useAuth();
  const { addToast } = useNotifications();
  const [analyzing, setAnalyzing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(student?.resumeAnalysis || null);
  const [resumeFile, setResumeFile] = useState(null);

  useEffect(() => {
    if (student?.resumeAnalysis) {
      setAnalysisResult(student.resumeAnalysis);
    }
  }, [student]);

  const handleUploadResume = async (e) => {
    e.preventDefault();
    if (!resumeFile) {
      addToast('Please select a resume file (PDF or DOCX)', 'warning');
      return;
    }

    const formData = new FormData();
    formData.append('file', resumeFile);
    formData.append('title', `${student?.user?.name || 'Student'} Resume`);
    formData.append('documentType', 'Resume');

    setUploading(true);
    try {
      const res = await documentService.uploadDocument(formData);
      if (res.success) {
        addToast('Resume uploaded! Now running automated AI audit...', 'success');
        await refreshUser();
        setResumeFile(null);
        await triggerAnalysis();
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Resume upload failed', 'error');
    } finally {
      setUploading(false);
    }
  };

  const triggerAnalysis = async () => {
    setAnalyzing(true);
    try {
      const res = await aiService.analyzeResume();
      if (res.success) {
        setAnalysisResult(res.analysis);
        addToast('AI Resume Analysis complete!', 'success');
        await refreshUser();
      }
    } catch (err) {
      addToast('Failed to complete AI Resume analysis', 'error');
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Resume & AI Optimization Center</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Maintain your primary recruitment resume and evaluate against ATS algorithms
          </p>
        </div>

        <Button
          size="md"
          variant="accent"
          loading={analyzing}
          onClick={triggerAnalysis}
          className="shadow-xs"
        >
          <Sparkles className="w-4 h-4 mr-1.5" /> Run AI Resume Audit
        </Button>
      </div>

      {/* Grid: Current Resume File on Left, AI Audit Results on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Current Uploaded Resume & Re-Upload */}
        <div className="space-y-6">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">
              Current Active Resume
            </h3>

            {student?.resumeUrl ? (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-lg bg-primary-100 text-primary-800 flex items-center justify-center">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">
                      {student?.user?.name || 'Student'}_Resume.pdf
                    </p>
                    <Badge variant="success" size="sm" dot className="mt-1">
                      Active for Drives
                    </Badge>
                  </div>
                </div>

                <div className="pt-2 flex gap-2">
                  <a
                    href={student.resumeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-primary-800 text-white text-xs font-semibold hover:bg-primary-900 transition"
                  >
                    <ExternalLink className="w-3.5 h-3.5" /> View / Preview
                  </a>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs">
                <AlertCircle className="w-5 h-5 text-amber-600 mb-1" />
                <span className="font-bold">No active resume on file: </span>
                Please upload a PDF copy of your resume to enable one-click applications for placement drives.
              </div>
            )}

            {/* Replace / Upload Form */}
            <form onSubmit={handleUploadResume} className="mt-5 pt-4 border-t border-slate-100 space-y-3">
              <label className="block text-xs font-semibold text-slate-700 uppercase">
                {student?.resumeUrl ? 'Replace Resume' : 'Upload New Resume'}
              </label>
              <input
                type="file"
                required
                accept=".pdf,.doc,.docx"
                onChange={(e) => setResumeFile(e.target.files[0])}
                className="w-full text-xs text-slate-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-primary-50 file:text-primary-800 hover:file:bg-primary-100"
              />
              <Button
                type="submit"
                variant="outline"
                size="sm"
                loading={uploading}
                className="w-full mt-2"
              >
                <Upload className="w-3.5 h-3.5 mr-1" />
                {student?.resumeUrl ? 'Upload & Replace' : 'Upload Resume'}
              </Button>
            </form>
          </div>
        </div>

        {/* Right Column (2 cols): AI Resume Audit Analysis Result */}
        <div className="lg:col-span-2 space-y-6">
          {analyzing ? (
            <div className="rounded-xl border border-slate-200 bg-white p-12 shadow-xs text-center">
              <Loader message="Scanning skills matrix, calculating ATS coverage score and evaluating section completeness..." />
            </div>
          ) : analysisResult ? (
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-6">
              {/* Score Meter Banner */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl bg-gradient-to-r from-blue-900 via-primary-800 to-indigo-900 text-white shadow-sm">
                <div>
                  <span className="text-[11px] font-semibold text-blue-200 uppercase tracking-widest block">
                    AI Resume Quality Score
                  </span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-4xl font-extrabold text-white">
                      {analysisResult.score}
                    </span>
                    <span className="text-slate-300 text-sm font-semibold">/ 100</span>
                  </div>
                  <p className="text-xs text-blue-200 mt-1">
                    {analysisResult.score >= 80
                      ? 'High Quality - Well formatted for corporate ATS scanners'
                      : 'Moderate Quality - Incorporate improvements below'}
                  </p>
                </div>

                <div className="sm:text-right">
                  <span className="text-xs font-semibold text-blue-200 block">
                    Detected Skills Count
                  </span>
                  <span className="text-2xl font-bold text-white">
                    {analysisResult.detectedSkills?.length || 0}
                  </span>
                </div>
              </div>

              {/* Strengths & Missing Sections */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Strengths */}
                <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200">
                  <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5 mb-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Resume Strengths
                  </h4>
                  <ul className="space-y-1.5 text-xs text-emerald-800">
                    {analysisResult.strengths?.map((s, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-emerald-500 font-bold">•</span>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Missing Sections */}
                <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200">
                  <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5 mb-2.5">
                    <AlertTriangle className="w-4 h-4 text-amber-600" /> Missing / Incomplete Sections
                  </h4>
                  {analysisResult.missingSections?.length > 0 ? (
                    <ul className="space-y-1.5 text-xs text-amber-800">
                      {analysisResult.missingSections.map((m, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-amber-500 font-bold">•</span>
                          <span>{m}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-emerald-700 font-medium">
                      All standard resume sections are detected!
                    </p>
                  )}
                </div>
              </div>

              {/* Actionable Improvement Suggestions */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5 mb-2.5">
                  <Lightbulb className="w-4 h-4 text-amber-500" /> Actionable Improvement Suggestions
                </h4>
                <div className="space-y-2 text-xs text-slate-700">
                  {analysisResult.improvementSuggestions?.map((tip, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="font-bold text-primary-800 text-xs">#{i + 1}</span>
                      <span>{tip}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Relevant Career Roles Alignment */}
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5 mb-3">
                  <Briefcase className="w-4 h-4 text-blue-600" /> Relevant Career Roles Alignment
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {analysisResult.recommendedRoles?.map((r, i) => (
                    <div key={i} className="p-3.5 rounded-lg border border-slate-200 bg-white">
                      <span className="text-xs font-bold text-slate-900 block truncate">
                        {r.role}
                      </span>
                      <div className="mt-1 flex items-center justify-between text-xs">
                        <span className="text-slate-500">Alignment:</span>
                        <span className="font-bold text-blue-700">{r.matchPercentage}%</span>
                      </div>
                      <span className="text-[11px] text-slate-400 block mt-1">
                        Est: {r.salaryRange}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mandatory Advisory Disclaimer */}
              <div className="p-3 rounded-lg bg-slate-100 border border-slate-200 text-[11px] text-slate-500 leading-relaxed italic">
                {analysisResult.disclaimer}
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center shadow-xs">
              <Sparkles className="w-8 h-8 text-blue-500 mx-auto mb-3" />
              <h3 className="text-sm font-bold text-slate-900">No Resume Audit Generated Yet</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-4">
                Click "Run AI Resume Audit" to trigger an automated analysis of your skills, project
                impact, and ATS readability.
              </p>
              <Button variant="accent" size="sm" onClick={triggerAnalysis}>
                Run Initial AI Resume Audit
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Resume;
