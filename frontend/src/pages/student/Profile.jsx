import React, { useState, useEffect } from 'react';
import {
  User,
  GraduationCap,
  Code2,
  FolderGit2,
  Briefcase,
  Award,
  Save,
  Plus,
  Trash2,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth.js';
import { useNotifications } from '../../hooks/useNotifications.js';
import { studentService } from '../../services/studentService.js';
import Button from '../../components/common/Button.jsx';
import Loader from '../../components/common/Loader.jsx';

const Profile = () => {
  const { user, student: initialStudent, refreshUser } = useAuth();
  const { addToast } = useNotifications();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    dob: '',
    gender: '',
    address: '',
    city: '',
    state: '',
    course: 'BCA',
    branch: 'Computer Applications',
    year: '3rd Year',
    tenthPercentage: 0,
    twelfthPercentage: 0,
    overallCgpa: 0,
    backlogs: 0,
    semesterMarks: [],
    skills: { technical: [], soft: [] },
    projects: [],
    internships: [],
    certifications: [],
  });

  const [techInput, setTechInput] = useState('');
  const [softInput, setSoftInput] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const res = await studentService.getMyProfile();
        if (res.success && res.student) {
          const s = res.student;
          setFormData({
            name: s.user?.name || '',
            phone: s.phone || '',
            dob: s.dob ? s.dob.split('T')[0] : '',
            gender: s.gender || '',
            address: s.address || '',
            city: s.city || '',
            state: s.state || '',
            course: s.course || 'BCA',
            branch: s.branch || 'Computer Applications',
            year: s.year || '3rd Year',
            tenthPercentage: s.tenthPercentage || 0,
            twelfthPercentage: s.twelfthPercentage || 0,
            overallCgpa: s.overallCgpa || 0,
            backlogs: s.backlogs || 0,
            semesterMarks: s.semesterMarks || [],
            skills: {
              technical: s.skills?.technical || [],
              soft: s.skills?.soft || [],
            },
            projects: s.projects || [],
            internships: s.internships || [],
            certifications: s.certifications || [],
          });
        }
      } catch (err) {
        console.error('Failed to load profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSave = async (e) => {
    e?.preventDefault();
    setSaving(true);
    try {
      const res = await studentService.updateMyProfile(formData);
      if (res.success) {
        addToast('Profile updated successfully!', 'success');
        await refreshUser();
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Error saving profile', 'error');
    } finally {
      setSaving(false);
    }
  };

  // Skill handlers
  const addTechnicalSkill = () => {
    if (!techInput.trim()) return;
    if (!formData.skills.technical.includes(techInput.trim())) {
      setFormData({
        ...formData,
        skills: {
          ...formData.skills,
          technical: [...formData.skills.technical, techInput.trim()],
        },
      });
    }
    setTechInput('');
  };

  const removeTechnicalSkill = (skill) => {
    setFormData({
      ...formData,
      skills: {
        ...formData.skills,
        technical: formData.skills.technical.filter((s) => s !== skill),
      },
    });
  };

  const addSoftSkill = () => {
    if (!softInput.trim()) return;
    if (!formData.skills.soft.includes(softInput.trim())) {
      setFormData({
        ...formData,
        skills: {
          ...formData.skills,
          soft: [...formData.skills.soft, softInput.trim()],
        },
      });
    }
    setSoftInput('');
  };

  const removeSoftSkill = (skill) => {
    setFormData({
      ...formData,
      skills: {
        ...formData.skills,
        soft: formData.skills.soft.filter((s) => s !== skill),
      },
    });
  };

  // Project handlers
  const addProject = () => {
    setFormData({
      ...formData,
      projects: [
        ...formData.projects,
        { name: '', description: '', technologies: [], githubUrl: '', liveUrl: '' },
      ],
    });
  };

  const updateProject = (index, field, value) => {
    const updated = [...formData.projects];
    updated[index][field] = value;
    setFormData({ ...formData, projects: updated });
  };

  const removeProject = (index) => {
    setFormData({
      ...formData,
      projects: formData.projects.filter((_, i) => i !== index),
    });
  };

  // Internship handlers
  const addInternship = () => {
    setFormData({
      ...formData,
      internships: [
        ...formData.internships,
        { organization: '', role: '', duration: '', description: '' },
      ],
    });
  };

  const updateInternship = (index, field, value) => {
    const updated = [...formData.internships];
    updated[index][field] = value;
    setFormData({ ...formData, internships: updated });
  };

  const removeInternship = (index) => {
    setFormData({
      ...formData,
      internships: formData.internships.filter((_, i) => i !== index),
    });
  };

  // Certification handlers
  const addCertification = () => {
    setFormData({
      ...formData,
      certifications: [
        ...formData.certifications,
        { name: '', issuingOrg: '', issueDate: '', url: '', credentialId: '' },
      ],
    });
  };

  const updateCertification = (index, field, value) => {
    const updated = [...formData.certifications];
    updated[index][field] = value;
    setFormData({ ...formData, certifications: updated });
  };

  const removeCertification = (index) => {
    setFormData({
      ...formData,
      certifications: formData.certifications.filter((_, i) => i !== index),
    });
  };

  if (loading) return <Loader message="Loading student profile details..." />;

  const tabs = [
    { id: 'personal', name: 'Personal Details', icon: User },
    { id: 'academic', name: 'Academic Records', icon: GraduationCap },
    { id: 'skills', name: 'Skills Matrix', icon: Code2 },
    { id: 'projects', name: 'Projects & Portfolio', icon: FolderGit2 },
    { id: 'internships', name: 'Internships', icon: Briefcase },
    { id: 'certifications', name: 'Certifications', icon: Award },
  ];

  const completion = initialStudent?.profileCompletion || 35;

  return (
    <div className="space-y-6">
      {/* Header with completion meter */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Student Profile & Portfolio</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Keep your profile accurate to maintain verified eligibility for visiting companies
          </p>
        </div>

        <div className="w-full md:w-72 bg-slate-50 p-3 rounded-lg border border-slate-200">
          <div className="flex justify-between items-center text-xs mb-1.5">
            <span className="font-semibold text-slate-700">Profile Completion</span>
            <span className="font-bold text-primary-800">{completion}%</span>
          </div>
          <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
            <div
              className="bg-primary-800 h-2 rounded-full transition-all duration-500"
              style={{ width: `${completion}%` }}
            />
          </div>
        </div>
      </div>

      {/* Tabs Row */}
      <div className="flex border-b border-slate-200 bg-white rounded-t-xl px-4 overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3.5 text-xs font-semibold whitespace-nowrap border-b-2 transition ${
                activeTab === tab.id
                  ? 'border-primary-800 text-primary-800'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.name}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div className="bg-white rounded-b-xl border border-slate-200 p-6 shadow-xs">
        {/* 1. PERSONAL DETAILS */}
        {activeTab === 'personal' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
              Personal Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-primary-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Contact Phone Number
                </label>
                <input
                  type="text"
                  placeholder="+91 9876543210"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-primary-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Date of Birth
                </label>
                <input
                  type="date"
                  value={formData.dob}
                  onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-primary-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Gender
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-primary-600"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Current Residential / Hostel Address
                </label>
                <input
                  type="text"
                  placeholder="Hostel / Street Address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-primary-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">City</label>
                <input
                  type="text"
                  placeholder="e.g. Pune"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-primary-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">State</label>
                <input
                  type="text"
                  placeholder="e.g. Maharashtra"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-primary-600"
                />
              </div>
            </div>
          </div>
        )}

        {/* 2. ACADEMIC RECORDS */}
        {activeTab === 'academic' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
              Academic Record & Scores
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Degree Course</label>
                <input
                  type="text"
                  value={formData.course}
                  onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Branch</label>
                <input
                  type="text"
                  value={formData.branch}
                  onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Graduation Year</label>
                <input
                  type="text"
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Overall CGPA (out of 10) *</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.overallCgpa}
                  onChange={(e) => setFormData({ ...formData, overallCgpa: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900 font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Class 10th Board %</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.tenthPercentage}
                  onChange={(e) => setFormData({ ...formData, tenthPercentage: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Class 12th Board %</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.twelfthPercentage}
                  onChange={(e) => setFormData({ ...formData, twelfthPercentage: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Active Backlogs *</label>
                <input
                  type="number"
                  value={formData.backlogs}
                  onChange={(e) => setFormData({ ...formData, backlogs: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900 font-bold"
                />
              </div>
            </div>
          </div>
        )}

        {/* 3. SKILLS */}
        {activeTab === 'skills' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">
                Technical Skills
              </h3>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  placeholder="Add skill (e.g. React, Node.js, SQL, Java)"
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTechnicalSkill())}
                  className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900"
                />
                <Button size="sm" onClick={addTechnicalSkill}>
                  <Plus className="w-3.5 h-3.5 mr-1" /> Add
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                {formData.skills.technical.map((skill, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-50 text-primary-900 border border-primary-200 text-xs font-semibold"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeTechnicalSkill(skill)}
                      className="text-primary-700 hover:text-rose-600"
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="border-t border-slate-100 pt-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">
                Soft & Interpersonal Skills
              </h3>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  placeholder="Add soft skill (e.g. Public Speaking, Problem Solving)"
                  value={softInput}
                  onChange={(e) => setSoftInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSoftSkill())}
                  className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900"
                />
                <Button size="sm" variant="secondary" onClick={addSoftSkill}>
                  <Plus className="w-3.5 h-3.5 mr-1" /> Add
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                {formData.skills.soft.map((skill, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-800 border border-slate-200 text-xs font-medium"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSoftSkill(skill)}
                      className="text-slate-500 hover:text-rose-600"
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 4. PROJECTS */}
        {activeTab === 'projects' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Technical Projects ({formData.projects.length})
              </h3>
              <Button size="sm" variant="outline" onClick={addProject}>
                <Plus className="w-3.5 h-3.5 mr-1" /> Add Project
              </Button>
            </div>

            {formData.projects.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">No projects added yet.</p>
            ) : (
              formData.projects.map((proj, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-700">Project #{idx + 1}</span>
                    <button
                      type="button"
                      onClick={() => removeProject(idx)}
                      className="text-rose-600 hover:text-rose-800 text-xs flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Remove
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Project Title"
                      value={proj.name}
                      onChange={(e) => updateProject(idx, 'name', e.target.value)}
                      className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs text-slate-900"
                    />
                    <input
                      type="text"
                      placeholder="GitHub Repository URL"
                      value={proj.githubUrl}
                      onChange={(e) => updateProject(idx, 'githubUrl', e.target.value)}
                      className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs text-slate-900"
                    />
                  </div>
                  <textarea
                    rows={2}
                    placeholder="Short description of technical architecture and problem solved..."
                    value={proj.description}
                    onChange={(e) => updateProject(idx, 'description', e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs text-slate-900"
                  />
                </div>
              ))
            )}
          </div>
        )}

        {/* 5. INTERNSHIPS */}
        {activeTab === 'internships' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Internships & Work Experience ({formData.internships.length})
              </h3>
              <Button size="sm" variant="outline" onClick={addInternship}>
                <Plus className="w-3.5 h-3.5 mr-1" /> Add Internship
              </Button>
            </div>

            {formData.internships.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">No internships added yet.</p>
            ) : (
              formData.internships.map((int, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-700">Experience #{idx + 1}</span>
                    <button
                      type="button"
                      onClick={() => removeInternship(idx)}
                      className="text-rose-600 hover:text-rose-800 text-xs flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Remove
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <input
                      type="text"
                      placeholder="Company / Organization"
                      value={int.organization}
                      onChange={(e) => updateInternship(idx, 'organization', e.target.value)}
                      className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs text-slate-900"
                    />
                    <input
                      type="text"
                      placeholder="Role (e.g. Frontend Intern)"
                      value={int.role}
                      onChange={(e) => updateInternship(idx, 'role', e.target.value)}
                      className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs text-slate-900"
                    />
                    <input
                      type="text"
                      placeholder="Duration (e.g. 3 Months)"
                      value={int.duration}
                      onChange={(e) => updateInternship(idx, 'duration', e.target.value)}
                      className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs text-slate-900"
                    />
                  </div>
                  <textarea
                    rows={2}
                    placeholder="Key responsibilities and contributions..."
                    value={int.description}
                    onChange={(e) => updateInternship(idx, 'description', e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs text-slate-900"
                  />
                </div>
              ))
            )}
          </div>
        )}

        {/* 6. CERTIFICATIONS */}
        {activeTab === 'certifications' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Certifications & Credentials ({formData.certifications.length})
              </h3>
              <Button size="sm" variant="outline" onClick={addCertification}>
                <Plus className="w-3.5 h-3.5 mr-1" /> Add Certification
              </Button>
            </div>

            {formData.certifications.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">No certifications added yet.</p>
            ) : (
              formData.certifications.map((cert, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-700">Certificate #{idx + 1}</span>
                    <button
                      type="button"
                      onClick={() => removeCertification(idx)}
                      className="text-rose-600 hover:text-rose-800 text-xs flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Remove
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <input
                      type="text"
                      placeholder="Certificate Name"
                      value={cert.name}
                      onChange={(e) => updateCertification(idx, 'name', e.target.value)}
                      className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs text-slate-900"
                    />
                    <input
                      type="text"
                      placeholder="Issuing Organization"
                      value={cert.issuingOrg}
                      onChange={(e) => updateCertification(idx, 'issuingOrg', e.target.value)}
                      className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs text-slate-900"
                    />
                    <input
                      type="text"
                      placeholder="Credential Verification Link"
                      value={cert.url}
                      onChange={(e) => updateCertification(idx, 'url', e.target.value)}
                      className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs text-slate-900"
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Global Save Button */}
        <div className="mt-8 border-t border-slate-100 pt-4 flex justify-end">
          <Button variant="primary" size="md" onClick={handleSave} loading={saving}>
            <Save className="w-4 h-4 mr-1.5" /> Save Changes & Update Completion Score
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
