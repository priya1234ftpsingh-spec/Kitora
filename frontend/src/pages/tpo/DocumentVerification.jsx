import React, { useState, useEffect } from 'react';
import {
  FileCheck2,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Filter,
  AlertCircle,
  FileText,
} from 'lucide-react';
import { documentService } from '../../services/documentService.js';
import { useNotifications } from '../../hooks/useNotifications.js';
import Button from '../../components/common/Button.jsx';
import Badge from '../../components/common/Badge.jsx';
import Modal from '../../components/common/Modal.jsx';
import Loader from '../../components/common/Loader.jsx';
import { formatDate } from '../../utils/formatDate.js';
import { getStatusBadgeVariant } from '../../utils/eligibility.js';

const DocumentVerification = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('Pending');
  const [typeFilter, setTypeFilter] = useState('');
  const [rejectModal, setRejectModal] = useState({ open: false, docId: null, reason: '' });
  const { addToast } = useNotifications();

  const fetchDocs = async () => {
    setLoading(true);
    try {
      const res = await documentService.getAllDocuments({
        status: statusFilter,
        documentType: typeFilter,
      });
      if (res.success) setDocuments(res.documents);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocs();
  }, [statusFilter, typeFilter]);

  const handleVerify = async (id, status, reason = '') => {
    try {
      const res = await documentService.verifyDocument(id, {
        status,
        rejectionReason: reason,
      });
      if (res.success) {
        addToast(`Document marked as ${status} & student notified`, 'success');
        setRejectModal({ open: false, docId: null, reason: '' });
        await fetchDocs();
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Verification failed', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Institutional Document Verification</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Audit student marksheets and academic certificates to authorize drive eligibility
          </p>
        </div>

        {/* Filter controls */}
        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs text-slate-700 font-semibold"
          >
            <option value="">All Statuses</option>
            <option value="Pending">Pending Audit</option>
            <option value="Verified">Verified</option>
            <option value="Rejected">Rejected</option>
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs text-slate-700"
          >
            <option value="">All Document Types</option>
            <option value="Resume">Resume</option>
            <option value="10th Marksheet">10th Marksheet</option>
            <option value="12th Marksheet">12th Marksheet</option>
            <option value="College Marksheet">College Marksheet</option>
            <option value="Certificate">Certificate</option>
          </select>
        </div>
      </div>

      {/* Documents Queue Table */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-16">
            <Loader message="Loading verification queue..." />
          </div>
        ) : documents.length === 0 ? (
          <div className="py-16 text-center text-xs text-slate-500">
            No documents found matching the filter criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="px-5 py-3.5">Student</th>
                  <th className="px-5 py-3.5">Document Title</th>
                  <th className="px-5 py-3.5">Category</th>
                  <th className="px-5 py-3.5">Upload Date</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Verification Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {documents.map((doc) => (
                  <tr key={doc._id} className="hover:bg-slate-50/70 transition">
                    <td className="px-5 py-4">
                      <div>
                        <p className="font-bold text-slate-900">{doc.student?.user?.name}</p>
                        <p className="text-[11px] text-slate-400 font-mono">
                          {doc.student?.rollNumber} • {doc.student?.course}
                        </p>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center space-x-2">
                        <FileText className="w-4 h-4 text-slate-400 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-slate-800">{doc.title}</p>
                          <a
                            href={doc.fileUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[11px] text-primary-700 hover:underline flex items-center gap-1 font-medium mt-0.5"
                          >
                            <ExternalLink className="w-3 h-3" /> Inspect Document File
                          </a>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4 font-medium text-slate-700">
                      {doc.documentType}
                    </td>

                    <td className="px-5 py-4 text-slate-500">
                      {formatDate(doc.createdAt)}
                    </td>

                    <td className="px-5 py-4">
                      <Badge variant={getStatusBadgeVariant(doc.status)} size="sm" dot>
                        {doc.status}
                      </Badge>
                      {doc.status === 'Rejected' && doc.rejectionReason && (
                        <p className="text-[10px] text-rose-600 font-medium mt-1 leading-tight">
                          {doc.rejectionReason}
                        </p>
                      )}
                    </td>

                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        {doc.status !== 'Verified' && (
                          <Button
                            size="sm"
                            variant="success"
                            onClick={() => handleVerify(doc._id, 'Verified')}
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

      {/* Reject Modal */}
      <Modal
        isOpen={rejectModal.open}
        onClose={() => setRejectModal({ open: false, docId: null, reason: '' })}
        title="Document Audit Rejection"
        subtitle="Specify audit discrepancy reason to notify the student"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Audit Failure Note *
            </label>
            <textarea
              rows={3}
              required
              placeholder="e.g. Scanned marksheet is blurry or marks total is not legible. Please re-upload verified original copy."
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
              disabled={!rejectModal.reason.trim()}
              onClick={() => handleVerify(rejectModal.docId, 'Rejected', rejectModal.reason)}
            >
              Confirm Rejection & Dispatch Notification
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default DocumentVerification;
