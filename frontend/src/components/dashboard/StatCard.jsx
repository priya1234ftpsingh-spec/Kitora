import React from 'react';

const StatCard = ({
  title,
  value,
  subtext,
  icon: Icon,
  variant = 'primary',
  trend,
  className = '',
}) => {
  const iconVariants = {
    primary: 'bg-primary-50 text-primary-800 border-primary-200',
    blue: 'bg-blue-50 text-blue-600 border-blue-200',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    amber: 'bg-amber-50 text-amber-600 border-amber-200',
    purple: 'bg-purple-50 text-purple-600 border-purple-200',
    rose: 'bg-rose-50 text-rose-600 border-rose-200',
  };

  return (
    <div
      className={`rounded-xl border border-slate-200 bg-white p-5 shadow-xs transition hover:shadow-sm ${className}`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          {title}
        </span>
        {Icon && (
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-lg border ${
              iconVariants[variant] || iconVariants.primary
            }`}
          >
            <Icon className="h-5 w-5" />
          </div>
        )}
      </div>

      <div className="mt-3 flex items-baseline space-x-2">
        <span className="text-2xl font-bold tracking-tight text-slate-900">{value}</span>
        {trend && (
          <span className="text-xs font-medium text-emerald-600 flex items-center">
            {trend}
          </span>
        )}
      </div>

      {subtext && <p className="mt-1 text-xs text-slate-500 font-medium">{subtext}</p>}
    </div>
  );
};

export default StatCard;
