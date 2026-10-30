import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Building2,
  MapPin,
  Calendar,
  IndianRupee,
  Briefcase,
  Users,
  Clock,
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { driveService } from '../../services/driveService.js';
import { applicationService } from '../../services/applicationService.js';
import { useAuth } from '../../hooks/useAuth.js';
import { useNotifications } from '../../hooks/useNotifications.js';
import EligibilityCard from '../../components/placement/EligibilityCard.jsx';
import ApplicationTimeline from '../../components/placement/ApplicationTimeline.jsx';
import Button from '../../components/common/Button.jsx';
import Badge from '../../components/common/Badge.jsx';
import Loader from '../../components/common/Loader.jsx';
import { formatDate, getDaysRemaining } from '../../utils/formatDate.js';
import { getStatusBadgeVariant } from '../../utils/eligibility.js';

const DriveDetails = () => {
  const { id } = useParams();
  const { student } = useAuth();
  const { addToast } = useNotifications();
  const [drive, setDrive] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);

  const fetchDrive = async () => {
    setLoading(true);
    try {
      const res = await driveService.getDriveById(id);
      if (res.success) setDrive(res.drive);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrive();
  }, [id]);

  const handleApply = async () => {
    setApplying(true);
    try {
      const res = await applicationService.applyToDrive(id);
      if (res.success) {
        addToast('Application submitted successfully!', 'success');
        await fetchDrive();
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Application failed', 'error');
    } finally {
      setApplying(false);
    }
  };

  if (loading) return <Loader message="Retrieving placement drive details..." />;
  if (!drive) return <div className="p-8 text-center text-xs text-slate-500">Placement drive not found.</div>;

  const isEligible = drive.eligibility?.isEligible;
  const daysRemaining = getDaysRemaining(drive.applicationDeadline);

  return (
    <div className="space-y-6">
      {/* Back button */}
      <Link
        to="/student/drives"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Placement Drives
      </Link>

      {/* Main Drive Banner */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-100 pb-6">
          <div className="flex items-start space-x-4">
            {drive.company?.logo ? (
              <img
                src={drive.company.logo}
                alt={drive.company.name}
                className="h-16 w-16 rounded-xl object-cover border border-slate-200"
              />
            ) : (
              <div className="h-16 w-16 rounded-xl bg-primary-800 text-white font-extrabold text-2xl flex items-center justify-center">
                {drive.company?.name?.charAt(0) || 'C'}
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <Badge variant={getStatusBadgeVariant(drive.status)} size="sm">
                  {drive.status}
                </Badge>
                <span className="text-xs text-slate-500">{drive.jobType}</span>
              </div>
              <h1 className="text-2xl font-bold text-slate-900 mt-1">
                {drive.jobRole}
              </h1>
              <div className="flex items-center gap-3 text-xs text-slate-600 mt-1">
                <span className="font-semibold text-slate-800">{drive.company?.name}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" /> {drive.location}
                </span>
                {drive.company?.website && (
                  <a
                    href={drive.company.website}
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary-700 hover:underline flex items-center gap-1 font-medium"
                  >
                    Website <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            {drive.hasApplied ? (
              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Application Submitted ({drive.application?.status})</span>
              </div>
            ) : (
              <Button
                variant={isEligible ? 'primary' : 'secondary'}
                size="lg"
                disabled={!isEligible || drive.status === 'Closed'}
                loading={applying}
                onClick={handleApply}
              >
                Apply for this Drive
              </Button>
            )}
          </div>
        </div>

        {/* Quick Highlights Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-5 text-xs">
          <div>
            <span className="text-slate-400 block font-semibold uppercase text-[10px]">
              Annual Package (CTC)
            </span>
            <span className="text-base font-bold text-slate-900 mt-0.5 block">
              ₹{drive.package} LPA
            </span>
            {drive.stipend && (
              <span className="text-[11px] text-slate-500">{drive.stipend}</span>
            )}
          </div>

          <div>
            <span className="text-slate-400 block font-semibold uppercase text-[10px]">
              Application Deadline
            </span>
            <span className="text-sm font-bold text-slate-900 mt-0.5 block">
              {formatDate(drive.applicationDeadline)}
            </span>
            <span
              className={`text-[11px] font-semibold ${
                daysRemaining <= 2 ? 'text-amber-600' : 'text-slate-500'
              }`}
            >
              {daysRemaining <= 0 ? 'Closed' : `${daysRemaining} days remaining`}
            </span>
          </div>

          <div>
            <span className="text-slate-400 block font-semibold uppercase text-[10px]">
              Vacancies Available
            </span>
            <span className="text-sm font-bold text-slate-900 mt-0.5 block">
              {drive.vacancies} Positions
            </span>
            <span className="text-[11px] text-slate-500">Subject to performance</span>
          </div>

          <div>
            <span className="text-slate-400 block font-semibold uppercase text-[10px]">
              Target Batch
            </span>
            <span className="text-sm font-bold text-slate-900 mt-0.5 block">
              {drive.eligibility?.allowedBranches?.join(', ')}
            </span>
            <span className="text-[11px] text-slate-500">
              {drive.eligibility?.allowedYears?.join(' / ')}
            </span>
          </div>
        </div>
      </div>

      {/* Application Status Timeline if student already applied */}
      {drive.hasApplied && drive.application && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">
            Your Application Timeline
          </h3>
          <ApplicationTimeline application={drive.application} />
        </div>
      )}

      {/* Automated Eligibility Evaluation Card */}
      <EligibilityCard
        eligibility={drive.eligibility}
        student={student}
        drive={drive}
      />

      {/* Job Description & Selection Process */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-5">
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">
              Role Overview & Responsibilities
            </h3>
            <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">
              {drive.description}
            </p>
          </div>

          <div className="border-t border-slate-100 pt-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">
              Required Technical Competencies
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {drive.requiredSkills?.map((skill, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-md bg-slate-100 text-slate-800 text-xs font-semibold"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="border-t border-slate-100 pt-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">
              Recruitment Process Schedule
            </h3>
            <p className="text-xs text-slate-600 mb-3">{drive.testSchedule}</p>
            <div className="space-y-2 text-xs">
              {drive.selectionProcess?.map((proc, i) => (
                <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="font-bold text-primary-800">Round {i + 1}:</span>
                  <span className="text-slate-800">{proc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Company Overview Card */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">
            About Company
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            {drive.company?.description || 'Corporate partner of college Training & Placement Cell.'}
          </p>
          <div className="border-t border-slate-100 pt-3 text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-500">Industry Sector:</span>
              <span className="font-semibold text-slate-800">{drive.company?.industry}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Headquarters / Hub:</span>
              <span className="font-semibold text-slate-800">{drive.company?.location}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriveDetails;
