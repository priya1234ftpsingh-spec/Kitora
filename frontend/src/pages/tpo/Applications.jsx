import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Layers,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  CalendarCheck2,
  Award,
  ExternalLink,
  User,
  Sparkles,
} from 'lucide-react';
import { applicationService } from '../../services/applicationService.js';
import { driveService } from '../../services/driveService.js';
import { interviewService } from '../../services/interviewService.js';
import { useNotifications } from '../../hooks/useNotifications.js';
import Button from '../../components/common/Button.jsx';
import Badge from '../../components/common/Badge.jsx';
import Modal from '../../components/common/Modal.jsx';
import Loader from '../../components/common/Loader.jsx';
import { formatDate } from '../../utils/formatDate.js';
import { getStatusBadgeVariant } from '../../utils/eligibility.js';

const Applications = () => {
  const [searchParams] = useSearchParams();
  const initialDriveId = searchParams.get('driveId') || '';

  const [applications, setApplications] = useState([]);
  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDrive, setSelectedDrive] = useState(initialDriveId);
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');
  const { addToast } = useNotifications();

  // Modals for Actions
  const [statusModal, setStatusModal] = useState({ open: false, app: null, status: 'Shortlisted', feedback: '' });
  const [scheduleModal, setScheduleModal] = useState({
    open: false,
    app: null,
    round: 'Technical Interview Round 1',
    date: '',
    time: '11:00 AM',
    venueType: 'Online',
    venueOrLink: 'https://meet.google.com/xyz',
    interviewerName: 'Technical Committee',
    instructions: 'Keep portfolio and GitHub repositories ready.',
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [appsRes, drivesRes] = await Promise.all([
        applicationService.getAllApplications({
          driveId: selectedDrive,
          status: statusFilter,
          search,
        }),
        driveService.getAllDrives(),
      ]);
      if (appsRes.success) setApplications(appsRes.applications);
      if (drivesRes.success) setDrives(drivesRes.drives);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedDrive, statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadData();
  };

  // Status progression action
  const handleUpdateStatus = async (e) => {
    e?.preventDefault();
    const { app, status, feedback } = statusModal;
    if (!app) return;

    try {
      const res = await applicationService.updateStatus(app._id, {
        status,
        feedback,
      });
      if (res.success) {
        addToast(`Application status updated to ${status}`, 'success');
        setStatusModal({ open: false, app: null, status: 'Shortlisted', feedback: '' });
        await loadData();
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Update failed', 'error');
    }
  };

  // Schedule interview action
  const handleScheduleInterview = async (e) => {
    e.preventDefault();
    const s = scheduleModal;
    if (!s.app) return;

    try {
      const res = await interviewService.scheduleInterview({
        applicationId: s.app._id,
        round: s.round,
        date: s.date,
        time: s.time,
        venueType: s.venueType,
        venueOrLink: s.venueOrLink,
        interviewerName: s.interviewerName,
        instructions: s.instructions,
      });

      if (res.success) {
        addToast('Interview scheduled and student notified!', 'success');
        setScheduleModal({ ...scheduleModal, open: false, app: null });
        await loadData();
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to schedule interview', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Application & Candidate Pipeline</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Review drive applicants, advance candidates through rounds, schedule interviews and record selections
          </p>
        </div>
      </div>

      {/* Filter Row */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs flex flex-wrap items-center gap-3">
        <form onSubmit={handleSearchSubmit} className="relative flex-1 min-w-[200px]">
          <input
            type="text"
            placeholder="Search by student name or roll number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-slate-300 pl-8 pr-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-primary-600"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
        </form>

        <select
          value={selectedDrive}
          onChange={(e) => setSelectedDrive(e.target.value)}
          className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs text-slate-700 max-w-xs"
        >
          <option value="">All Placement Drives</option>
          {drives.map((d) => (
            <option key={d._id} value={d._id}>
              {d.company?.name} - {d.jobRole}
            </option>
          ))}
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs text-slate-700 font-semibold"
        >
          <option value="">All Statuses</option>
          <option value="Applied">Applied</option>
          <option value="Shortlisted">Shortlisted</option>
          <option value="Interview Scheduled">Interview Scheduled</option>
          <option value="Selected">Selected</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-16">
            <Loader message="Loading student applications..." />
          </div>
        ) : applications.length === 0 ? (
          <div className="py-16 text-center text-xs text-slate-500">
            No applications match the current search / filter parameters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="px-5 py-3.5">Candidate</th>
                  <th className="px-5 py-3.5">Placement Drive</th>
                  <th className="px-5 py-3.5">Academics</th>
                  <th className="px-5 py-3.5">Applied Date</th>
                  <th className="px-5 py-3.5">Current Stage</th>
                  <th className="px-5 py-3.5 text-right">Workflow Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {applications.map((app) => (
                  <tr key={app._id} className="hover:bg-slate-50/70 transition">
                    <td className="px-5 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="h-8 w-8 rounded-full bg-primary-100 text-primary-800 flex items-center justify-center font-bold text-xs">
                          {app.student?.user?.name?.charAt(0) || 'S'}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{app.student?.user?.name}</p>
                          <p className="text-[11px] text-slate-400 font-mono">
                            {app.profileSnapshot?.rollNumber || app.student?.rollNumber}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <p className="font-bold text-slate-800">{app.drive?.jobRole}</p>
                      <p className="text-slate-500 text-[11px] font-medium">
                        {app.drive?.company?.name} (₹{app.drive?.package} LPA)
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <span className="font-bold text-slate-900">
                        CGPA: {app.profileSnapshot?.cgpa || app.student?.overallCgpa}
                      </span>
                      <span className="text-[11px] text-slate-500 block">
                        {app.profileSnapshot?.course || app.student?.course}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-slate-600">
                      {formatDate(app.appliedAt)}
                    </td>

                    <td className="px-5 py-4">
                      <Badge variant={getStatusBadgeVariant(app.status)} size="sm" dot>
                        {app.status}
                      </Badge>
                      <span className="text-[10px] text-slate-400 block mt-0.5">
                        {app.currentRound}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end space-x-1.5">
                        <Link
                          to={`/tpo/students/${app.student?._id}`}
                          className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg"
                          title="View Profile"
                        >
                          <User className="w-4 h-4" />
                        </Link>

                        {/* Shortlist action */}
                        {app.status === 'Applied' && (
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() =>
                              setStatusModal({
                                open: true,
                                app,
                                status: 'Shortlisted',
                                feedback: 'Profile shortlisted for technical round.',
                              })
                            }
                          >
                            Shortlist
                          </Button>
                        )}

                        {/* Schedule Interview action */}
                        {['Applied', 'Shortlisted'].includes(app.status) && (
                          <Button
                            size="sm"
                            variant="primary"
                            onClick={() =>
                              setScheduleModal({
                                open: true,
                                app,
                                round: 'Technical Interview',
                                date: '',
                                time: '11:00 AM',
                                venueType: 'Online',
                                venueOrLink: 'https://meet.google.com/xyz',
                                interviewerName: 'Technical Panel',
                                instructions: 'Please keep your resume and portfolio links ready.',
                              })
                            }
                          >
                            <CalendarCheck2 className="w-3.5 h-3.5 mr-1" /> Interview
                          </Button>
                        )}

                        {/* Select Offer action */}
                        {app.status !== 'Selected' && (
                          <Button
                            size="sm"
                            variant="success"
                            onClick={() =>
                              setStatusModal({
                                open: true,
                                app,
                                status: 'Selected',
                                feedback: 'Congratulations! Selected for employment offer.',
                              })
                            }
                          >
                            Select
                          </Button>
                        )}

                        {/* Reject action */}
                        {app.status !== 'Rejected' && (
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() =>
                              setStatusModal({
                                open: true,
                                app,
                                status: 'Rejected',
                                feedback: 'Thank you for participating. Candidate did not qualify in final evaluation.',
                              })
                            }
                          >
                            Reject
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Status Transition Modal */}
      <Modal
        isOpen={statusModal.open}
        onClose={() => setStatusModal({ open: false, app: null, status: 'Shortlisted', feedback: '' })}
        title={`Update Status: ${statusModal.status}`}
        subtitle={`Candidate: ${statusModal.app?.student?.user?.name}`}
      >
        <form onSubmit={handleUpdateStatus} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Feedback / Note for Student
            </label>
            <textarea
              rows={3}
              placeholder="Comments or reason for candidate progression..."
              value={statusModal.feedback}
              onChange={(e) => setStatusModal({ ...statusModal, feedback: e.target.value })}
              className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-900"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setStatusModal({ open: false, app: null, status: 'Shortlisted', feedback: '' })
              }
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant={statusModal.status === 'Selected' ? 'success' : statusModal.status === 'Rejected' ? 'danger' : 'primary'}
              size="sm"
            >
              Confirm {statusModal.status}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Schedule Interview Modal */}
      <Modal
        isOpen={scheduleModal.open}
        onClose={() => setScheduleModal({ ...scheduleModal, open: false, app: null })}
        title="Schedule Interview Round"
        subtitle={`Candidate: ${scheduleModal.app?.student?.user?.name} (${scheduleModal.app?.drive?.company?.name})`}
      >
        <form onSubmit={handleScheduleInterview} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Interview Round Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Technical Coding Round 1"
              value={scheduleModal.round}
              onChange={(e) => setScheduleModal({ ...scheduleModal, round: e.target.value })}
              className="w-full rounded-lg border border-slate-300 p-2 text-xs text-slate-900"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Date *
              </label>
              <input
                type="date"
                required
                value={scheduleModal.date}
                onChange={(e) => setScheduleModal({ ...scheduleModal, date: e.target.value })}
                className="w-full rounded-lg border border-slate-300 p-2 text-xs text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Time *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. 11:00 AM - 11:45 AM"
                value={scheduleModal.time}
                onChange={(e) => setScheduleModal({ ...scheduleModal, time: e.target.value })}
                className="w-full rounded-lg border border-slate-300 p-2 text-xs text-slate-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Interview Mode
              </label>
              <select
                value={scheduleModal.venueType}
                onChange={(e) => setScheduleModal({ ...scheduleModal, venueType: e.target.value })}
                className="w-full rounded-lg border border-slate-300 p-2 text-xs text-slate-900"
              >
                <option value="Online">Online Video Call</option>
                <option value="On-Campus">On-Campus Lab / Hall</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Venue or Online Meeting Link *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. https://meet.google.com/... or Seminar Hall 2"
                value={scheduleModal.venueOrLink}
                onChange={(e) => setScheduleModal({ ...scheduleModal, venueOrLink: e.target.value })}
                className="w-full rounded-lg border border-slate-300 p-2 text-xs text-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Evaluator / Panelist Name
            </label>
            <input
              type="text"
              placeholder="e.g. Lead Technical Architect, NexusTech"
              value={scheduleModal.interviewerName}
              onChange={(e) => setScheduleModal({ ...scheduleModal, interviewerName: e.target.value })}
              className="w-full rounded-lg border border-slate-300 p-2 text-xs text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Instructions for Student
            </label>
            <textarea
              rows={2}
              value={scheduleModal.instructions}
              onChange={(e) => setScheduleModal({ ...scheduleModal, instructions: e.target.value })}
              className="w-full rounded-lg border border-slate-300 p-2 text-xs text-slate-900"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-2 border-t border-slate-100">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setScheduleModal({ ...scheduleModal, open: false, app: null })}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Confirm Schedule & Dispatch Alert
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Applications;
