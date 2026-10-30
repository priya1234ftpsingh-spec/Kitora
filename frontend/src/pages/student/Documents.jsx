import React, { useState, useEffect } from 'react';
import {
  FileText,
  Upload,
  Trash2,
  ExternalLink,
  AlertCircle,
  CheckCircle2,
  Clock,
  XCircle,
  FileCheck2,
} from 'lucide-react';
import { documentService } from '../../services/documentService.js';
import { useNotifications } from '../../hooks/useNotifications.js';
import Button from '../../components/common/Button.jsx';
import Badge from '../../components/common/Badge.jsx';
import Modal from '../../components/common/Modal.jsx';
import ConfirmDialog from '../../components/common/ConfirmDialog.jsx';
import Loader from '../../components/common/Loader.jsx';
import { formatDate } from '../../utils/formatDate.js';
import { getStatusBadgeVariant } from '../../utils/eligibility.js';

const Documents = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, docId: null });
  const [uploading, setUploading] = useState(false);
  const { addToast } = useNotifications();

  // Upload Form
  const [title, setTitle] = useState('');
  const [documentType, setDocumentType] = useState('College Marksheet');
  const [file, setFile] = useState(null);

  const fetchDocs = async () => {
    setLoading(true);
    try {
      const res = await documentService.getMyDocuments();
      if (res.success) setDocuments(res.documents);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocs();
  }, []);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      if (selected.size > 10 * 1024 * 1024) {
        addToast('File size exceeds maximum limit of 10MB.', 'error');
        return;
      }
      setFile(selected);
      if (!title) setTitle(selected.name.replace(/\.[^/.]+$/, ''));
    }
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      addToast('Please select a file to upload', 'warning');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);
    formData.append('documentType', documentType);

    setUploading(true);
    try {
      const res = await documentService.uploadDocument(formData);
      if (res.success) {
        addToast('Document uploaded successfully!', 'success');
        setUploadModalOpen(false);
        setTitle('');
        setFile(null);
        await fetchDocs();
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Upload failed', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteDialog.docId) return;
    try {
      const res = await documentService.deleteMyDocument(deleteDialog.docId);
      if (res.success) {
        addToast('Document removed', 'success');
        setDeleteDialog({ open: false, docId: null });
        await fetchDocs();
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Error deleting file', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Document Management & Verification</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Upload institutional marksheets, certificates and resume for placement eligibility audit
          </p>
        </div>

        <Button size="md" variant="primary" onClick={() => setUploadModalOpen(true)}>
          <Upload className="w-4 h-4 mr-1.5" /> Upload Document
        </Button>
      </div>

      {/* Audit Policy Notice */}
      <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200 text-xs text-blue-900 flex items-start space-x-3">
        <FileCheck2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <span className="font-bold">Institutional Document Policy: </span>
          All submitted 10th, 12th, and college semester marksheets undergo verification by the
          Placement Officer (TPO). Once verified, documents cannot be deleted without prior TPO
          de-authorization. Ensure uploaded scans are sharp and legible.
        </div>
      </div>

      {/* Document List Table */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-12">
            <Loader message="Loading your documents..." />
          </div>
        ) : documents.length === 0 ? (
          <div className="py-16 text-center text-xs text-slate-500">
            No documents uploaded yet. Click "Upload Document" to begin.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="px-5 py-3.5">Document Title</th>
                  <th className="px-5 py-3.5">Type</th>
                  <th className="px-5 py-3.5">Upload Date</th>
                  <th className="px-5 py-3.5">Audit Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {documents.map((doc) => (
                  <tr key={doc._id} className="hover:bg-slate-50/70 transition">
                    <td className="px-5 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{doc.title}</p>
                          <p className="text-[11px] text-slate-400 font-mono">
                            {doc.fileName} • {(doc.fileSize / 1024).toFixed(1)} KB
                          </p>
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
                      <div>
                        <Badge variant={getStatusBadgeVariant(doc.status)} size="sm" dot>
                          {doc.status}
                        </Badge>
                        {doc.status === 'Rejected' && doc.rejectionReason && (
                          <p className="text-[11px] text-rose-600 font-medium mt-1 leading-tight flex items-center gap-1">
                            <AlertCircle className="w-3 h-3 flex-shrink-0" />
                            Reason: {doc.rejectionReason}
                          </p>
                        )}
                      </div>
                    </td>

                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <a
                          href={doc.fileUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-slate-700 bg-slate-100 hover:bg-slate-200 transition font-medium"
                        >
                          <ExternalLink className="w-3.5 h-3.5" /> View
                        </a>
                        {doc.status !== 'Verified' && (
                          <button
                            onClick={() => setDeleteDialog({ open: true, docId: doc._id })}
                            className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
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

      {/* Upload Modal */}
      <Modal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        title="Upload Student Document"
        subtitle="Supported formats: PDF, DOCX, PNG, JPG (Max 10MB)"
      >
        <form onSubmit={handleUploadSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Document Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Semester 5 Consolidated Grade Card"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-xs text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Document Category *
            </label>
            <select
              value={documentType}
              onChange={(e) => setDocumentType(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900"
            >
              <option value="Resume">Resume / CV</option>
              <option value="10th Marksheet">10th Marksheet</option>
              <option value="12th Marksheet">12th Marksheet</option>
              <option value="College Marksheet">College Semester Marksheet</option>
              <option value="Certificate">Certificate / Credential</option>
              <option value="Identity Proof">College Identity Proof</option>
              <option value="Other">Other Institutional Document</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Select File *
            </label>
            <input
              type="file"
              required
              accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
              onChange={handleFileChange}
              className="w-full text-xs text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-primary-50 file:text-primary-800 hover:file:bg-primary-100"
            />
          </div>

          <div className="pt-4 flex justify-end space-x-2 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setUploadModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" loading={uploading}>
              Submit for Verification
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, docId: null })}
        onConfirm={handleDelete}
        title="Delete Document"
        message="Are you sure you want to remove this unverified document?"
      />
    </div>
  );
};

export default Documents;
