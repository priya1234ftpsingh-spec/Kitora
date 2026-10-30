import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Briefcase,
  Plus,
  Edit2,
  Trash2,
  Users,
  Clock,
  Eye,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { driveService, companyService } from '../../services/driveService.js';
import { useNotifications } from '../../hooks/useNotifications.js';
import Button from '../../components/common/Button.jsx';
import Badge from '../../components/common/Badge.jsx';
import Modal from '../../components/common/Modal.jsx';
import ConfirmDialog from '../../components/common/ConfirmDialog.jsx';
import Loader from '../../components/common/Loader.jsx';
import { formatDate } from '../../utils/formatDate.js';
import { getStatusBadgeVariant } from '../../utils/eligibility.js';

const PlacementDrives = () => {
  const [drives, setDrives] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null });
  const { addToast } = useNotifications();

  // Drive form state
  const [formData, setFormData] = useState({
    company: '',
    jobRole: '',
    jobType: 'Full-Time',
    description: '',
    package: 6.0,
    stipend: '',
    location: 'Pune / Bengaluru / Hybrid',
    minCgpa: 6.5,
    minTenthPercentage: 60,
    minTwelfthPercentage: 60,
    maxBacklogs: 0,
    allowedBranches: ['BCA', 'MCA', 'Computer Applications'],
    allowedYears: ['3rd Year', 'Final Year'],
    requiredSkills: '',
    vacancies: 5,
    applicationDeadline: '',
    selectionProcess: 'Round 1: Online Assessment, Round 2: Technical Interview, Round 3: HR Interview',
    testSchedule: 'To be announced post shortlisting',
    status: 'Open',
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [drivesRes, compsRes] = await Promise.all([
        driveService.getAllDrives(),
        companyService.getAllCompanies({ isActive: true }),
      ]);
      if (drivesRes.success) setDrives(drivesRes.drives);
      if (compsRes.success) setCompanies(compsRes.companies);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openAddModal = () => {
    setEditingId(null);
    setFormData({
      company: companies[0]?._id || '',
      jobRole: '',
      jobType: 'Full-Time',
      description: '',
      package: 6.0,
      stipend: '',
      location: 'Pune / Bengaluru / Hybrid',
      minCgpa: 6.5,
      minTenthPercentage: 60,
      minTwelfthPercentage: 60,
      maxBacklogs: 0,
      allowedBranches: ['BCA', 'MCA', 'Computer Applications'],
      allowedYears: ['3rd Year', 'Final Year'],
      requiredSkills: 'React, Node.js, SQL, Git',
      vacancies: 5,
      applicationDeadline: '',
      selectionProcess: 'Round 1: Online Assessment, Round 2: Technical Interview, Round 3: HR Interview',
      testSchedule: 'To be announced post shortlisting',
      status: 'Open',
    });
    setModalOpen(true);
  };

  const openEditModal = (d) => {
    setEditingId(d._id);
    setFormData({
      company: d.company?._id || '',
      jobRole: d.jobRole,
      jobType: d.jobType || 'Full-Time',
      description: d.description,
      package: d.package,
      stipend: d.stipend || '',
      location: d.location,
      minCgpa: d.eligibility?.minCgpa || 6.0,
      minTenthPercentage: d.eligibility?.minTenthPercentage || 60,
      minTwelfthPercentage: d.eligibility?.minTwelfthPercentage || 60,
      maxBacklogs: d.eligibility?.maxBacklogs || 0,
      allowedBranches: d.eligibility?.allowedBranches || ['BCA', 'MCA'],
      allowedYears: d.eligibility?.allowedYears || ['3rd Year'],
      requiredSkills: (d.requiredSkills || []).join(', '),
      vacancies: d.vacancies || 1,
      applicationDeadline: d.applicationDeadline ? d.applicationDeadline.split('T')[0] : '',
      selectionProcess: (d.selectionProcess || []).join(', '),
      testSchedule: d.testSchedule || '',
      status: d.status || 'Open',
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      company: formData.company,
      jobRole: formData.jobRole,
      jobType: formData.jobType,
      description: formData.description,
      package: Number(formData.package),
      stipend: formData.stipend,
      location: formData.location,
      eligibility: {
        minCgpa: Number(formData.minCgpa),
        minTenthPercentage: Number(formData.minTenthPercentage),
        minTwelfthPercentage: Number(formData.minTwelfthPercentage),
        maxBacklogs: Number(formData.maxBacklogs),
        allowedBranches: formData.allowedBranches,
        allowedYears: formData.allowedYears,
      },
      requiredSkills: formData.requiredSkills
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      vacancies: Number(formData.vacancies),
      applicationDeadline: formData.applicationDeadline,
      selectionProcess: formData.selectionProcess
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      testSchedule: formData.testSchedule,
      status: formData.status,
    };

    try {
      if (editingId) {
        const res = await driveService.updateDrive(editingId, payload);
        if (res.success) {
          addToast('Placement drive updated successfully!', 'success');
          setModalOpen(false);
          await loadData();
        }
      } else {
        const res = await driveService.createDrive(payload);
        if (res.success) {
          addToast('Placement drive published and students notified!', 'success');
          setModalOpen(false);
          await loadData();
        }
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Drive save failed', 'error');
    }
  };

  const handleCloseDrive = async (id) => {
    try {
      const res = await driveService.updateDrive(id, { status: 'Closed' });
      if (res.success) {
        addToast('Drive marked as Closed', 'success');
        await loadData();
      }
    } catch (err) {
      addToast('Error closing drive', 'error');
    }
  };

  const handleDelete = async () => {
    if (!deleteDialog.id) return;
    try {
      const res = await driveService.deleteDrive(deleteDialog.id);
      if (res.success) {
        addToast(res.message, 'success');
        setDeleteDialog({ open: false, id: null });
        await loadData();
      }
    } catch (err) {
      addToast('Error deleting drive', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Placement Drives Governance</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure visiting job roles, strict eligibility gates, vacancies and recruitment pipelines
          </p>
        </div>

        <Button size="md" variant="primary" onClick={openAddModal}>
          <Plus className="w-4 h-4 mr-1.5" /> Create Placement Drive
        </Button>
      </div>

      {/* Drives Table */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-16">
            <Loader message="Loading placement drives repository..." />
          </div>
        ) : drives.length === 0 ? (
          <div className="py-16 text-center text-xs text-slate-500">
            No placement drives created yet. Click "Create Placement Drive" to post a job role.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="px-5 py-3.5">Company & Role</th>
                  <th className="px-5 py-3.5">Package</th>
                  <th className="px-5 py-3.5">Eligibility Criteria</th>
                  <th className="px-5 py-3.5">Application Deadline</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {drives.map((d) => (
                  <tr key={d._id} className="hover:bg-slate-50/70 transition">
                    <td className="px-5 py-4">
                      <div>
                        <p className="font-bold text-slate-900 text-sm">{d.jobRole}</p>
                        <p className="text-xs text-slate-600 font-medium">{d.company?.name}</p>
                        <span className="text-[11px] text-slate-400">{d.location}</span>
                      </div>
                    </td>

                    <td className="px-5 py-4 font-bold text-slate-900 text-sm">
                      ₹{d.package} LPA
                    </td>

                    <td className="px-5 py-4">
                      <span className="font-semibold text-slate-800">
                        Min {d.eligibility?.minCgpa} CGPA
                      </span>
                      <span className="text-[11px] text-slate-500 block">
                        Max {d.eligibility?.maxBacklogs} Backlogs • {d.eligibility?.allowedBranches?.join(', ')}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-slate-600 font-medium">
                      {formatDate(d.applicationDeadline)}
                    </td>

                    <td className="px-5 py-4">
                      <Badge variant={getStatusBadgeVariant(d.status)} size="sm">
                        {d.status}
                      </Badge>
                    </td>

                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Link
                          to={`/tpo/applications?driveId=${d._id}`}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-primary-800 bg-primary-50 hover:bg-primary-100 font-semibold"
                          title="View Applicants"
                        >
                          <Users className="w-3.5 h-3.5" /> Applicants
                        </Link>
                        <Button variant="outline" size="sm" onClick={() => openEditModal(d)}>
                          <Edit2 className="w-3.5 h-3.5" />
                        </Button>
                        {d.status !== 'Closed' && (
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handleCloseDrive(d._id)}
                            title="Close Drive"
                          >
                            Close
                          </Button>
                        )}
                        <button
                          onClick={() => setDeleteDialog({ open: true, id: d._id })}
                          className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Drive Creation / Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? 'Edit Placement Drive' : 'Configure New Placement Drive'}
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Recruiting Partner Company *
              </label>
              <select
                required
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="w-full rounded-lg border border-slate-300 p-2 text-xs text-slate-900"
              >
                <option value="">Select Company</option>
                {companies.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Job Role / Designation *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Associate Software Engineer"
                value={formData.jobRole}
                onChange={(e) => setFormData({ ...formData, jobRole: e.target.value })}
                className="w-full rounded-lg border border-slate-300 p-2 text-xs text-slate-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Package (CTC in LPA) *
              </label>
              <input
                type="number"
                step="0.1"
                required
                placeholder="e.g. 6.5"
                value={formData.package}
                onChange={(e) => setFormData({ ...formData, package: e.target.value })}
                className="w-full rounded-lg border border-slate-300 p-2 text-xs text-slate-900 font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Job Type
              </label>
              <select
                value={formData.jobType}
                onChange={(e) => setFormData({ ...formData, jobType: e.target.value })}
                className="w-full rounded-lg border border-slate-300 p-2 text-xs text-slate-900"
              >
                <option value="Full-Time">Full-Time</option>
                <option value="Internship">Internship</option>
                <option value="Internship + PPO">Internship + PPO</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Vacancies Count
              </label>
              <input
                type="number"
                value={formData.vacancies}
                onChange={(e) => setFormData({ ...formData, vacancies: e.target.value })}
                className="w-full rounded-lg border border-slate-300 p-2 text-xs text-slate-900"
              />
            </div>
          </div>

          {/* Eligibility Section Box */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Automatic Eligibility Criteria Configuration
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Min Overall CGPA
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.minCgpa}
                  onChange={(e) => setFormData({ ...formData, minCgpa: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 p-1.5 text-xs text-slate-900 font-semibold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Max Active Backlogs
                </label>
                <input
                  type="number"
                  value={formData.maxBacklogs}
                  onChange={(e) => setFormData({ ...formData, maxBacklogs: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 p-1.5 text-xs text-slate-900 font-semibold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Min 10th Score %
                </label>
                <input
                  type="number"
                  value={formData.minTenthPercentage}
                  onChange={(e) => setFormData({ ...formData, minTenthPercentage: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 p-1.5 text-xs text-slate-900"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Min 12th Score %
                </label>
                <input
                  type="number"
                  value={formData.minTwelfthPercentage}
                  onChange={(e) => setFormData({ ...formData, minTwelfthPercentage: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 p-1.5 text-xs text-slate-900"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Application Deadline *
              </label>
              <input
                type="date"
                required
                value={formData.applicationDeadline}
                onChange={(e) => setFormData({ ...formData, applicationDeadline: e.target.value })}
                className="w-full rounded-lg border border-slate-300 p-2 text-xs text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Drive Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full rounded-lg border border-slate-300 p-2 text-xs text-slate-900"
              >
                <option value="Open">Open</option>
                <option value="Closing Soon">Closing Soon</option>
                <option value="Closed">Closed</option>
                <option value="Draft">Draft</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Required Skills (Comma separated)
            </label>
            <input
              type="text"
              placeholder="e.g. React, Node.js, Express, MongoDB, Git"
              value={formData.requiredSkills}
              onChange={(e) => setFormData({ ...formData, requiredSkills: e.target.value })}
              className="w-full rounded-lg border border-slate-300 p-2 text-xs text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Job Description & Candidate Responsibilities *
            </label>
            <textarea
              rows={3}
              required
              placeholder="Detailed description of duties and qualifications..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full rounded-lg border border-slate-300 p-2 text-xs text-slate-900"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
            <Button variant="outline" size="sm" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              {editingId ? 'Save Changes' : 'Publish Placement Drive'}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, id: null })}
        onConfirm={handleDelete}
        title="Delete Placement Drive"
        message="If students have already applied, the drive status will be transitioned to Closed rather than deleted."
      />
    </div>
  );
};

export default PlacementDrives;
