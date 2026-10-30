import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  User,
  GraduationCap,
  Briefcase,
  FileCheck2,
  CalendarCheck2,
  Layers,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Award,
} from 'lucide-react';
import { studentService } from '../../services/studentService.js';
import { documentService } from '../../services/documentService.js';
import { useNotifications } from '../../hooks/useNotifications.js';
import Button from '../../components/common/Button.jsx';
import Badge from '../../components/common/Badge.jsx';
import Modal from '../../components/common/Modal.jsx';
import Loader from '../../components/common/Loader.jsx';
import { formatDate } from '../../utils/formatDate.js';
import { getStatusBadgeVariant } from '../../utils/eligibility.js';

const StudentProfile = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusModal, setStatusModal] = useState(false);
  const [rejectModal, setRejectModal] = useState({ open: false, docId: null, reason: '' });
  const [newStatus, setNewStatus] = useState('Placed');
  const [placedCompany, setPlacedCompany] = useState('');
  const [placedPackage, setPlacedPackage] = useState('');
  const { addToast } = useNotifications();

  const fetchStudentData = async () => {
    setLoading(true);
    try {
      const res = await studentService.getStudentById(id);
      if (res.success) {
        setData(res);
        setNewStatus(res.student.placementStatus);
        setPlacedCompany(res.student.placedCompany || '');
        setPlacedPackage(res.student.placedPackage || '');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudentData();
  }, [id]);

  const handleVerifyDoc = async (docId, status, rejectionReason = '') => {
    try {
      const res = await documentService.verifyDocument(docId, {
        status,
        rejectionReason,
      });
      if (res.success) {
        addToast(`Document marked as ${status}`, 'success');
        setRejectModal({ open: false, docId: null, reason: '' });
        await fetchStudentData();
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Verification update failed', 'error');
    }
  };

  const handleUpdatePlacementStatus = async (e) => {
    e.preventDefault();
    try {
      const res = await studentService.updatePlacementStatus(id, {
        placementStatus: newStatus,
        placedCompany,
        placedPackage,
      });
      if (res.success) {
        addToast('Student placement status updated!', 'success');
        setStatusModal(false);
        await fetchStudentData();
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Status update failed', 'error');
    }
  };

  if (loading) return <Loader message="Retrieving student complete credentials..." />;
  if (!data?.student) return <div className="p-8 text-center text-xs text-slate-500">Student not found.</div>;

  const st = data.student;

  return (
    <div className="space-y-6">
      <Link
        to="/tpo/students"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Students Directory
      </Link>

      {/* Profile Header */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          {st.user?.avatar ? (
            <img
              src={st.user.avatar}
              alt={st.user.name}
              className="h-16 w-16 rounded-full object-cover border border-slate-200"
            />
          ) : (
            <div className="h-16 w-16 rounded-full bg-primary-100 text-primary-800 font-extrabold text-2xl flex items-center justify-center">
              {st.user?.name?.charAt(0) || 'S'}
            </div>
          )}
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900">{st.user?.name}</h1>
              <Badge variant={getStatusBadgeVariant(st.placementStatus)} size="sm" dot>
                {st.placementStatus}
              </Badge>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Roll: <span className="font-mono font-semibold text-slate-800">{st.rollNumber}</span> • Email: {st.user?.email} • Phone: {st.phone || 'N/A'}
            </p>
            <p className="text-xs text-slate-600 mt-0.5">
              {st.course} • {st.branch} • {st.year}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={() => setStatusModal(true)}>
            <Award className="w-4 h-4 mr-1.5" /> Update Placement Status
          </Button>
        </div>
      </div>

      {/* Academics & Skills Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Academic Scores */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-3">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Academic Performance
          </h3>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Overall CGPA:</span>
              <span className="font-bold text-slate-900 text-sm">{st.overallCgpa?.toFixed(2)} / 10</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Active Backlogs:</span>
              <span className={`font-bold ${st.backlogs > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                {st.backlogs}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">10th Grade Score:</span>
              <span className="font-semibold text-slate-800">{st.tenthPercentage}%</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">12th Grade Score:</span>
              <span className="font-semibold text-slate-800">{st.twelfthPercentage}%</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500">Profile Completion:</span>
              <span className="font-bold text-primary-800">{st.profileCompletion}%</span>
            </div>
          </div>
        </div>

        {/* Technical & Soft Skills */}
        <div className="md:col-span-2 rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
              Registered Technical Skills
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {st.skills?.technical?.map((sk, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded bg-slate-100 text-slate-800 text-xs font-medium"
                >
                  {sk}
                </span>
              ))}
            </div>
          </div>

          <div className="border-t border-slate-100 pt-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
              Soft Skills
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {st.skills?.soft?.map((sk, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded bg-blue-50 text-blue-800 text-xs font-medium"
                >
                  {sk}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Uploaded Documents Verification Box */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
          Student Uploaded Documents ({data.documents?.length || 0})
        </h3>

        {data.documents?.length === 0 ? (
          <p className="text-xs text-slate-400 py-4">No documents uploaded by this student.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[11px]">
                <tr>
                  <th className="px-4 py-3">Title</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Upload Date</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Verification Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.documents.map((doc) => (
                  <tr key={doc._id}>
                    <td className="px-4 py-3 font-semibold text-slate-900">
                      <div className="flex items-center gap-2">
                        <span>{doc.title}</span>
                        <a
                          href={doc.fileUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-primary-700 hover:text-primary-900"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{doc.documentType}</td>
                    <td className="px-4 py-3 text-slate-500">{formatDate(doc.createdAt)}</td>
                    <td className="px-4 py-3">
                      <Badge variant={getStatusBadgeVariant(doc.status)} size="sm" dot>
                        {doc.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        {doc.status !== 'Verified' && (
                          <Button
                            size="sm"
                            variant="success"
                            onClick={() => handleVerifyDoc(doc._id, 'Verified')}
                          >
                            Approve
                          </Button>
                        )}
                        {doc.status !== 'Rejected' && (
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() =>
                              setRejectModal({ open: true, docId: doc._id, reason: '' })
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

      {/* Applications & Interview History */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Applications */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-3">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Placement Applications History ({data.applications?.length || 0})
          </h3>
          {data.applications?.length === 0 ? (
            <p className="text-xs text-slate-400 py-4">No applications submitted yet.</p>
          ) : (
            <div className="space-y-2.5 text-xs">
              {data.applications.map((app) => (
                <div key={app._id} className="p-3 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-slate-900">{app.drive?.jobRole}</p>
                    <p className="text-slate-500 text-[11px]">{app.drive?.company?.name}</p>
                  </div>
                  <Badge variant={getStatusBadgeVariant(app.status)} size="sm">
                    {app.status}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Interviews */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-3">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Scheduled Interviews ({data.interviews?.length || 0})
          </h3>
          {data.interviews?.length === 0 ? (
            <p className="text-xs text-slate-400 py-4">No interviews logged.</p>
          ) : (
            <div className="space-y-2.5 text-xs">
              {data.interviews.map((iv) => (
                <div key={iv._id} className="p-3 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-slate-900">{iv.round}</p>
                    <p className="text-slate-500 text-[11px]">{formatDate(iv.date)} • {iv.time}</p>
                  </div>
                  <Badge variant={getStatusBadgeVariant(iv.status)} size="sm">
                    {iv.status}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Rejection Reason Modal */}
      <Modal
        isOpen={rejectModal.open}
        onClose={() => setRejectModal({ open: false, docId: null, reason: '' })}
        title="Reject Student Document"
        subtitle="A notification with this rejection reason will be dispatched to the student"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Rejection Reason *
            </label>
            <textarea
              rows={3}
              required
              placeholder="e.g. Scanned copy is illegible. Please re-upload high resolution mark statement."
              value={rejectModal.reason}
              onChange={(e) => setRejectModal({ ...rejectModal, reason: e.target.value })}
              className="w-full rounded-lg border border-slate-300 p-3 text-xs text-slate-900"
            />
          </div>
          <div className="flex justify-end space-x-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setRejectModal({ open: false, docId: null, reason: '' })}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={() => handleVerifyDoc(rejectModal.docId, 'Rejected', rejectModal.reason)}
            >
              Confirm Rejection
            </Button>
          </div>
        </div>
      </Modal>

      {/* Update Placement Status Modal */}
      <Modal
        isOpen={statusModal}
        onClose={() => setStatusModal(false)}
        title="Update Student Placement Status"
      >
        <form onSubmit={handleUpdatePlacementStatus} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Placement Status
            </label>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="w-full rounded-lg border border-slate-300 p-2 text-xs text-slate-900"
            >
              <option value="Not Placed">Not Placed</option>
              <option value="Placed">Placed</option>
              <option value="Opted Out">Opted Out</option>
            </select>
          </div>

          {newStatus === 'Placed' && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Placed Recruiting Company
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. NexusTech Solutions"
                  value={placedCompany}
                  onChange={(e) => setPlacedCompany(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 p-2 text-xs text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Salary Package Offered (LPA)
                </label>
                <input
                  type="number"
                  step="0.1"
                  required
                  placeholder="e.g. 6.5"
                  value={placedPackage}
                  onChange={(e) => setPlacedPackage(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 p-2 text-xs text-slate-900"
                />
              </div>
            </>
          )}

          <div className="flex justify-end space-x-2 pt-3">
            <Button variant="outline" size="sm" onClick={() => setStatusModal(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Save Placement Record
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default StudentProfile;
