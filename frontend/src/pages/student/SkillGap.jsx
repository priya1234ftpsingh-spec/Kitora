import React, { useState, useEffect } from 'react';
import {
  GitCompare,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
  ArrowRight,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth.js';
import { aiService } from '../../services/aiService.js';
import Button from '../../components/common/Button.jsx';
import Badge from '../../components/common/Badge.jsx';
import Loader from '../../components/common/Loader.jsx';

const SkillGap = () => {
  const { student } = useAuth();
  const [selectedRole, setSelectedRole] = useState('Full Stack Developer');
  const [customSkills, setCustomSkills] = useState('');
  const [isCustom, setIsCustom] = useState(false);
  const [loading, setLoading] = useState(false);
  const [auditData, setAuditData] = useState(null);

  const availableRoles = [
    'Full Stack Developer',
    'Frontend Developer',
    'Backend Developer',
    'Data Analyst',
    'Software Engineer',
    'Cloud / DevOps Engineer',
  ];

  const runSkillGapAnalysis = async (target) => {
    setLoading(true);
    try {
      const res = await aiService.analyzeSkillGap(target || selectedRole);
      if (res.success) {
        setAuditData(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runSkillGapAnalysis('Full Stack Developer');
  }, []);

  const handleRoleChange = (role) => {
    setSelectedRole(role);
    setIsCustom(false);
    runSkillGapAnalysis(role);
  };

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    if (!customSkills.trim()) return;
    setIsCustom(true);
    runSkillGapAnalysis(customSkills);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">AI Skill-Gap & Competency Analysis</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Benchmark your profile skills against visiting corporate requirements to identify missing technologies
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="purple" size="md">
            Profile: {student?.skills?.technical?.length || 0} Registered Skills
          </Badge>
        </div>
      </div>

      {/* Role Selection Tabs */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Select Target Career Role to Audit
          </label>
          <div className="flex flex-wrap gap-2">
            {availableRoles.map((role) => (
              <button
                key={role}
                onClick={() => handleRoleChange(role)}
                className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition ${
                  selectedRole === role && !isCustom
                    ? 'bg-primary-800 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {role}
              </button>
            ))}
          </div>
        </div>

        {/* Custom skills comparison input */}
        <div className="pt-3 border-t border-slate-100">
          <form onSubmit={handleCustomSubmit} className="flex gap-2">
            <input
              type="text"
              placeholder="Or enter custom required skills separated by comma (e.g. Java, Spring Boot, MySQL, Docker)..."
              value={customSkills}
              onChange={(e) => setCustomSkills(e.target.value)}
              className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900"
            />
            <Button type="submit" variant="outline" size="sm">
              Audit Custom Stack
            </Button>
          </form>
        </div>
      </div>

      {/* Analysis Results Display */}
      {loading ? (
        <div className="py-16">
          <Loader message="Comparing technical taxonomy and formulating learning roadmap..." />
        </div>
      ) : auditData ? (
        <div className="space-y-6">
          {/* Top Score Banner */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-primary-900 via-primary-800 to-slate-900 text-white shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[11px] font-semibold text-blue-200 uppercase tracking-widest block">
                Target Role Alignment
              </span>
              <h2 className="text-xl sm:text-2xl font-bold mt-1">
                {auditData.role}
              </h2>
              <p className="text-xs text-blue-200 mt-1">
                {auditData.matchPercentage >= 75
                  ? 'Strong Skill Alignment - Recommended to apply for these drives'
                  : 'Skill Gap Detected - Follow the recommended learning roadmap below'}
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur border border-white/20 p-4 rounded-xl text-center min-w-[140px]">
              <span className="text-[11px] font-semibold text-slate-200 block uppercase">
                Skill Match Rate
              </span>
              <span className="text-3xl font-extrabold text-white mt-1 block">
                {auditData.matchPercentage}%
              </span>
            </div>
          </div>

          {/* Matched vs Missing Comparison Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Matched Skills */}
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/40 p-5 shadow-xs">
              <div className="flex items-center justify-between border-b border-emerald-200 pb-3 mb-3">
                <h3 className="text-xs font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Matched Skills (
                  {auditData.matchingSkills?.length || 0})
                </h3>
                <span className="text-xs font-semibold text-emerald-700">Present in Profile</span>
              </div>

              {auditData.matchingSkills?.length === 0 ? (
                <p className="text-xs text-slate-500 py-3">
                  None of the target skills matched your current profile.
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {auditData.matchingSkills.map((sk, i) => (
                    <div
                      key={i}
                      className="px-3 py-1.5 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-semibold border border-emerald-200 flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> {sk}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Missing Skills (Skill Gaps) */}
            <div className="rounded-xl border border-amber-200 bg-amber-50/40 p-5 shadow-xs">
              <div className="flex items-center justify-between border-b border-amber-200 pb-3 mb-3">
                <h3 className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600" /> Missing Skills / Gaps (
                  {auditData.missingSkills?.length || 0})
                </h3>
                <span className="text-xs font-semibold text-amber-700">Action Required</span>
              </div>

              {auditData.missingSkills?.length === 0 ? (
                <p className="text-xs text-emerald-700 font-semibold py-3">
                  Outstanding! You have all skills required for this role.
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {auditData.missingSkills.map((sk, i) => (
                    <div
                      key={i}
                      className="px-3 py-1.5 rounded-lg bg-amber-100 text-amber-800 text-xs font-semibold border border-amber-200 flex items-center gap-1"
                    >
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600" /> {sk}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Suggested Learning Roadmap Sequence */}
          {auditData.learningRoadmap?.length > 0 && (
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center space-x-2">
                  <BookOpen className="w-5 h-5 text-primary-800" />
                  <h3 className="text-sm font-bold text-slate-900">
                    Targeted Upskilling Roadmap & Preparation Sequence
                  </h3>
                </div>
                <span className="text-xs text-slate-500 font-medium">
                  Estimated 2-4 weeks study plan
                </span>
              </div>

              <div className="space-y-4">
                {auditData.learningRoadmap.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-start justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-primary-900 bg-white px-2.5 py-0.5 rounded border border-slate-200">
                          Step #{idx + 1}
                        </span>
                        <h4 className="text-sm font-bold text-slate-900">{item.skill}</h4>
                        <Badge
                          variant={item.priority === 'High' ? 'danger' : 'warning'}
                          size="sm"
                        >
                          {item.priority} Priority
                        </Badge>
                      </div>

                      <div className="mt-2.5 space-y-1 text-xs text-slate-700">
                        {item.suggestedTopics?.map((t, tIdx) => (
                          <div key={tIdx} className="flex items-start gap-1.5">
                            <span className="text-primary-600 font-bold">•</span>
                            <span>{t}</span>
                          </div>
                        ))}
                      </div>

                      {item.recommendedCertifications?.length > 0 && (
                        <p className="mt-2 text-[11px] text-slate-500 italic">
                          Recommended Course:{' '}
                          <span className="font-semibold text-slate-700">
                            {item.recommendedCertifications.join(', ')}
                          </span>
                        </p>
                      )}
                    </div>

                    <div className="sm:text-right flex-shrink-0">
                      <span className="text-[11px] font-semibold text-slate-400 block uppercase">
                        Effort
                      </span>
                      <span className="text-xs font-bold text-slate-800 block mt-0.5">
                        {item.estimatedHours}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Advisory Disclaimer */}
          <div className="p-3.5 rounded-lg bg-slate-100 border border-slate-200 text-[11px] text-slate-500 italic leading-relaxed">
            {auditData.disclaimer}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default SkillGap;
