import React, { useState, useEffect } from 'react';
import { Building2, Plus, Edit2, Trash2, ExternalLink, MapPin } from 'lucide-react';
import { companyService } from '../../services/driveService.js';
import { useNotifications } from '../../hooks/useNotifications.js';
import Button from '../../components/common/Button.jsx';
import Badge from '../../components/common/Badge.jsx';
import Modal from '../../components/common/Modal.jsx';
import ConfirmDialog from '../../components/common/ConfirmDialog.jsx';
import Loader from '../../components/common/Loader.jsx';

const Companies = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null });
  const { addToast } = useNotifications();

  const [formData, setFormData] = useState({
    name: '',
    industry: 'Information Technology',
    location: 'Pune / Bengaluru / Hybrid',
    website: '',
    logo: '',
    description: '',
    contactEmail: '',
    contactPhone: '',
  });

  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const res = await companyService.getAllCompanies();
      if (res.success) setCompanies(res.companies);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const openAddModal = () => {
    setEditingId(null);
    setFormData({
      name: '',
      industry: 'Information Technology',
      location: 'Pune / Bengaluru / Hybrid',
      website: '',
      logo: '',
      description: '',
      contactEmail: '',
      contactPhone: '',
    });
    setModalOpen(true);
  };

  const openEditModal = (comp) => {
    setEditingId(comp._id);
    setFormData({
      name: comp.name,
      industry: comp.industry,
      location: comp.location,
      website: comp.website,
      logo: comp.logo,
      description: comp.description,
      contactEmail: comp.contactEmail || '',
      contactPhone: comp.contactPhone || '',
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        const res = await companyService.updateCompany(editingId, formData);
        if (res.success) {
          addToast('Company updated successfully!', 'success');
          setModalOpen(false);
          await fetchCompanies();
        }
      } else {
        const res = await companyService.createCompany(formData);
        if (res.success) {
          addToast('New company registered!', 'success');
          setModalOpen(false);
          await fetchCompanies();
        }
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Operation failed', 'error');
    }
  };

  const handleDelete = async () => {
    if (!deleteDialog.id) return;
    try {
      const res = await companyService.deleteCompany(deleteDialog.id);
      if (res.success) {
        addToast(res.message, 'success');
        setDeleteDialog({ open: false, id: null });
        await fetchCompanies();
      }
    } catch (err) {
      addToast('Error removing company', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Corporate Recruitment Partners</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage visiting companies, recruiter contacts and industry affiliations
          </p>
        </div>

        <Button size="md" variant="primary" onClick={openAddModal}>
          <Plus className="w-4 h-4 mr-1.5" /> Add New Company
        </Button>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="py-16">
          <Loader message="Loading corporate partners directory..." />
        </div>
      ) : companies.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center text-xs text-slate-500">
          No corporate partners registered. Click "Add New Company" to add one.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {companies.map((comp) => (
            <div
              key={comp._id}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs flex flex-col justify-between space-y-4 hover:shadow-md transition"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    {comp.logo ? (
                      <img
                        src={comp.logo}
                        alt={comp.name}
                        className="h-11 w-11 rounded-lg object-cover border border-slate-200"
                      />
                    ) : (
                      <div className="h-11 w-11 rounded-lg bg-primary-800 text-white font-bold text-sm flex items-center justify-center">
                        {comp.name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <h3 className="text-base font-bold text-slate-900 leading-tight">
                        {comp.name}
                      </h3>
                      <span className="text-[11px] font-medium text-slate-500 block mt-0.5">
                        {comp.industry}
                      </span>
                    </div>
                  </div>

                  <Badge variant={comp.isActive ? 'success' : 'neutral'} size="sm">
                    {comp.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>

                <p className="mt-3 text-xs text-slate-600 line-clamp-3 leading-relaxed">
                  {comp.description || 'Corporate recruitment partner.'}
                </p>

                <div className="mt-4 pt-3 border-t border-slate-100 text-xs space-y-1 text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span className="truncate">{comp.location}</span>
                  </div>
                  {comp.website && (
                    <a
                      href={comp.website}
                      target="_blank"
                      rel="noreferrer"
                      className="text-primary-700 hover:underline flex items-center gap-1 font-medium"
                    >
                      Visit Website <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-2">
                <Button variant="outline" size="sm" onClick={() => openEditModal(comp)}>
                  <Edit2 className="w-3.5 h-3.5 mr-1" /> Edit
                </Button>
                <button
                  onClick={() => setDeleteDialog({ open: true, id: comp._id })}
                  className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Add / Edit */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? 'Edit Corporate Partner' : 'Register New Corporate Partner'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Company Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. NexusTech Solutions"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-900"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Industry Sector *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Information Technology"
                value={formData.industry}
                onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-900"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Office / Hiring Hub
              </label>
              <input
                type="text"
                placeholder="e.g. Bengaluru / Pune"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Website URL
              </label>
              <input
                type="url"
                placeholder="https://example.com"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-900"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Logo URL (Optional)
              </label>
              <input
                type="url"
                placeholder="https://..."
                value={formData.logo}
                onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Company Overview & Profile
            </label>
            <textarea
              rows={3}
              placeholder="Brief summary of company domain and business..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-900"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
            <Button variant="outline" size="sm" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              {editingId ? 'Save Changes' : 'Register Partner'}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, id: null })}
        onConfirm={handleDelete}
        title="Remove Company"
        message="Are you sure? If active drives exist, the company will be deactivated to preserve audit trails."
      />
    </div>
  );
};

export default Companies;
